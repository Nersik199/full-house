import { Injectable, NotFoundException } from '@nestjs/common';
import { HeaderDiningRoomCreateDto } from './dto/header.dto';
import { HeaderAboutUsUpdateDto } from '@/about_us/dto/header.dto';
import { InjectModel } from '@nestjs/sequelize';
import { DiningRoom } from './entities/dining_room.entity';
import { FilesService } from '@/files/files.service';
import {
  DiningRoomCreateDto,
  DiningRoomUpdateDto,
} from './dto/dining_room.createDto';

@Injectable()
export class DiningRoomService {
  constructor(
    @InjectModel(DiningRoom)
    private readonly diningRoomModel: typeof DiningRoom,
    private readonly filesService: FilesService,
  ) {}

  async createHeader(
    dto: HeaderDiningRoomCreateDto,
    file?: Express.Multer.File,
  ) {
    const uploaded = await this.filesService.upload(file, 'header');

    const headerData = await this.diningRoomModel.create({
      ...dto,
      image: uploaded,
    });

    return headerData;
  }

  async getHeader() {
    const getHeader = await this.diningRoomModel.findAll();
    if (!getHeader) {
      throw new NotFoundException('header info not found');
    }
    return getHeader;
  }

  async updateHeader(
    id: number,
    urlId: string,
    dto: HeaderAboutUsUpdateDto,
    file?: Express.Multer.File,
  ) {
    await this.filesService.delete(urlId);
    const newImg = await this.filesService.upload(file, 'header');
    const [updatedCount, [updatedHeader]] = await this.diningRoomModel.update(
      { ...dto, image: newImg },
      {
        where: { id },
        returning: true,
      },
    );

    if (updatedCount === 0) throw new NotFoundException('About-Us not found');

    return updatedHeader;
  }

  async create(dto: DiningRoomCreateDto, file?: Express.Multer.File) {
    try {
      const uploaded = await this.filesService.upload(file, 'dining-room');

      const diningRoom = await this.diningRoomModel.create({
        ...dto,
        image: uploaded,
      });

      return diningRoom;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    const diningRoom = await this.diningRoomModel.findAll({
      order: [['created_at', 'DESC']],
    });

    if (!diningRoom || diningRoom.length === 0) {
      throw new NotFoundException('No Dining room found');
    }

    return diningRoom;
  }

  async findById(id: number) {
    const diningRoom = await this.diningRoomModel.findByPk(id);
    if (!diningRoom) {
      throw new NotFoundException(`Dining room with id ${id} not found`);
    }
    return diningRoom;
  }

  async update(
    id: number,
    dto: DiningRoomUpdateDto,
    urlId: string,
    file?: Express.Multer.File,
  ) {
    const diningRoom = await this.diningRoomModel.findByPk(id);

    if (!diningRoom) {
      throw new NotFoundException('Dining room not found');
    }

    let images: string[] = Array.isArray(diningRoom.image)
      ? [...diningRoom.image]
      : [];

    if (file) {
      const targetKey = urlId.startsWith('/') ? urlId.slice(1) : urlId;

      await this.filesService.delete(targetKey);

      images = images.filter((img) => {
        const imgKey = this.filesService.extractKey(img);
        return imgKey !== targetKey;
      });

      const newImg = await this.filesService.upload(file, 'dining-room');
      images.push(newImg);
    }

    await diningRoom.update({
      ...dto,
      images,
    });

    return diningRoom;
  }

  async delete(id: number) {
    const diningRoom = await this.diningRoomModel.findOne({ where: { id } });
    await diningRoom.destroy();
    const parsedUrl = new URL(diningRoom.image);
    const pathOnly = parsedUrl.pathname;
    await this.filesService.delete(pathOnly);
    return { message: 'Dining room successfully deleted' };
  }
}
