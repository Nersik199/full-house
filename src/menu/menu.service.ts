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
    let newImg: string;
    if (urlId && file) {
      await this.filesService.delete(urlId);
      newImg = await this.filesService.upload(file, 'header');
    }
    const [updatedCount, [updatedHeader]] = await this.headerModel.update(
      { ...dto, image: newImg },
      {
        where: { id },
        returning: true,
      },
    );

    if (updatedCount === 0) throw new NotFoundException('Menu not found');

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
    const menus = await this.menuModel.findAll({
      order: [['created_at', 'DESC']],
    });

    if (!menus || menus.length === 0) {
      throw new NotFoundException('No rooms found');
    }

    return menus;
  }

  async findById(id: number) {
    const menu = await this.menuModel.findByPk(id);
    if (!menu) {
      throw new NotFoundException(`menu with id ${id} not found`);
    }
    return menu;
  }

  async update(
    id: number,
    dto: MenuUpdateDto,
    urlId?: string,
    file?: Express.Multer.File,
  ) {
    const menu = await this.menuModel.findByPk(id);

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    let image: string = menu.image || '';
    if (file && urlId) {
      const targetKey = urlId.startsWith('/') ? urlId.slice(1) : urlId;

      await this.filesService.delete(targetKey);

      image = await this.filesService.upload(file, 'menu');
    }

    await menu.update({
      ...dto,
      image,
    });

    return menu;
  }

  async delete(id: number) {
    const menu = await this.menuModel.findOne({ where: { id } });
    await menu.destroy();
    const parsedUrl = new URL(menu.image);
    const pathOnly = parsedUrl.pathname;
    await this.filesService.delete(pathOnly);
    return { message: 'Menu successfully deleted' };
  }
}
