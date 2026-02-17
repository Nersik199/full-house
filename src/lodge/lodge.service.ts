import { FilesService } from '@/files/files.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HeaderLodge } from './entities/header.entity';
import { HeaderLodgeCreateDto, HeaderLodgeUpdateDto } from './dto/header.dto';
import { LodgeCreateDto, LodgeUpdateDto } from './dto/lodge.dto';
import { Lodge } from './entities/lodge.entity';

@Injectable()
export class LodgeService {
  constructor(
    @InjectModel(Lodge)
    private lodgeModel: typeof Lodge,
    @InjectModel(HeaderLodge)
    private readonly headerModel: typeof HeaderLodge,
    private readonly filesService: FilesService,
  ) {}

  async createHeader(dto: HeaderLodgeCreateDto, file?: Express.Multer.File) {
    const uploaded = await this.filesService.upload(file, 'header');

    const headerData = await this.headerModel.create({
      ...dto,
      image: uploaded,
    });

    return headerData;
  }

  async getHeader() {
    const getHeader = await this.headerModel.findAll();
    if (!getHeader) {
      throw new NotFoundException('header info not found');
    }
    return getHeader;
  }

  async updateHeader(
    id: number,
    urlId: string,
    dto: HeaderLodgeUpdateDto,
    file?: Express.Multer.File,
  ) {
    await this.filesService.delete(urlId);
    const newImg = await this.filesService.upload(file, 'header');
    const [updatedCount, [updatedHeader]] = await this.headerModel.update(
      { ...dto, image: newImg },
      {
        where: { id },
        returning: true,
      },
    );

    if (updatedCount === 0) throw new NotFoundException('Room not found');

    return updatedHeader;
  }

  async create(dto: LodgeCreateDto, files?: Express.Multer.File[]) {
    const imageUrls = await this.filesService.uploadMany(files, 'lodge');

    const lodge = await this.lodgeModel.create({
      ...dto,
      images: imageUrls,
    });

    return lodge;
  }

  async findAll() {
    const lodge = await this.lodgeModel.findAll({
      order: [['created_at', 'DESC']],
    });

    if (!lodge || lodge.length === 0) {
      throw new NotFoundException('No lodge found');
    }

    return lodge;
  }

  async findById(id: number) {
    const room = await this.lodgeModel.findByPk(id);
    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return room;
  }

  async update(
    id: number,
    dto: LodgeUpdateDto,
    urlId: string,
    file?: Express.Multer.File,
  ) {
    const lodge = await this.lodgeModel.findByPk(id);

    if (!lodge) {
      throw new NotFoundException('lodge not found');
    }

    let images: string[] = Array.isArray(lodge.images) ? [...lodge.images] : [];

    if (file) {
      const targetKey = urlId.startsWith('/') ? urlId.slice(1) : urlId;

      await this.filesService.delete(targetKey);

      images = images.filter((img) => {
        const imgKey = this.filesService.extractKey(img);
        return imgKey !== targetKey;
      });

      const newImg = await this.filesService.upload(file, 'lodge');
      images.push(newImg);
    }

    await lodge.update({
      ...dto,
      images,
    });

    return lodge;
  }

  async updateLodge(id: number, startDate: Date, endDate: Date) {
    await this.lodgeModel.update(
      {
        Busy: true,
        rentalStart: new Date(startDate),
        rentalEnd: new Date(endDate),
      },
      {
        where: {
          id,
        },
      },
    );
  }

  async delete(id: number) {
    const lodge = await this.lodgeModel.findOne({ where: { id } });

    const image: string[] = Array.isArray(lodge.images)
      ? [...lodge.images]
      : [];

    image.forEach(async (img) => {
      const parsedUrl = new URL(img);

      const pathOnly = parsedUrl.pathname;
      await this.filesService.delete(pathOnly);
    });

    await lodge.destroy();
    return { message: 'Room successfully deleted' };
  }
}
