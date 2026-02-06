import { MenuModule } from './menu.module';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from '@/files/files.service';
import { MenuCreateDto, MenuUpdateDto } from './dto/menu.dto';
import { HeaderMenuCreateDto, HeaderMenuUpdateDto } from './dto/header.dto';
import { HeaderMenu } from './entities/header.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private menuModel: typeof Menu,
    @InjectModel(HeaderMenu)
    private readonly headerModel: typeof HeaderMenu,
    private readonly filesService: FilesService,
  ) {}

  async createHeader(dto: HeaderMenuCreateDto, file?: Express.Multer.File) {
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
    dto: HeaderMenuUpdateDto,
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

  async create(dto: MenuCreateDto, file?: Express.Multer.File) {
    const imageUrls = await this.filesService.upload(file, 'menu');

    const menu = await this.menuModel.create({
      ...dto,
      image: imageUrls,
    });

    return menu;
  }

  async findAll() {
    const rooms = await this.menuModel.findAll({
      order: [['created_at', 'DESC']],
    });

    if (!rooms || rooms.length === 0) {
      throw new NotFoundException('No rooms found');
    }

    return rooms;
  }

  async findById(id: number) {
    const room = await this.menuModel.findByPk(id);
    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return room;
  }

  async update(
    id: number,
    dto: MenuUpdateDto,
    urlId: string,
    file?: Express.Multer.File,
  ) {
    const menu = await this.menuModel.findByPk(id);

    if (!menu) {
      throw new NotFoundException('Room not found');
    }

    let image: string[] = Array.isArray(menu.image) ? [...menu.image] : [];

    if (file) {
      const targetKey = urlId.startsWith('/') ? urlId.slice(1) : urlId;

      await this.filesService.delete(targetKey);

      image = image.filter((img) => {
        const imgKey = this.filesService.extractKey(img);
        return imgKey !== targetKey;
      });

      const newImg = await this.filesService.upload(file, 'menu');
      image.push(newImg);
    }

    await menu.update({
      ...dto,
      image,
    });

    return menu;
  }

  async delete(id: number) {
    const room = await this.findById(id);
    await room.destroy();
    return { message: 'Room successfully deleted' };
  }
}
