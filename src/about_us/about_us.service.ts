import { Injectable, NotFoundException } from '@nestjs/common';
import { AboutUs } from './entities/about_us.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from '@/files/files.service';
import { AboutUsCreateDto, AboutUsUpdateDto } from './dto/about_us.createDto';
import {
  HeaderAboutUsCreateDto,
  HeaderAboutUsUpdateDto,
} from './dto/header.dto';

@Injectable()
export class AboutUsService {
  constructor(
    @InjectModel(AboutUs)
    private readonly aboutUsModel: typeof AboutUs,
    private readonly filesService: FilesService,
  ) {}

  async createHeader(dto: HeaderAboutUsCreateDto, file?: Express.Multer.File) {
    const uploaded = await this.filesService.upload(file, 'header');

    const headerData = await this.aboutUsModel.create({
      ...dto,
      image: uploaded,
    });

    return headerData;
  }

  async getHeader() {
    const getHeader = await this.aboutUsModel.findAll();
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
    const [updatedCount, [updatedHeader]] = await this.aboutUsModel.update(
      { ...dto, image: newImg },
      {
        where: { id },
        returning: true,
      },
    );

    if (updatedCount === 0) throw new NotFoundException('About-Us not found');

    return updatedHeader;
  }

  async create(dto: AboutUsCreateDto, file?: Express.Multer.File) {
    try {
      const uploaded = await this.filesService.upload(file, 'about-us');

      const aboutAs = await this.aboutUsModel.create({
        ...dto,
        image: uploaded,
      });

      return aboutAs;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    const menus = await this.aboutUsModel.findAll({
      order: [['created_at', 'DESC']],
    });

    if (!menus || menus.length === 0) {
      throw new NotFoundException('No rooms found');
    }

    return menus;
  }

  async findById(id: number) {
    const menu = await this.aboutUsModel.findByPk(id);
    if (!menu) {
      throw new NotFoundException(`menu with id ${id} not found`);
    }
    return menu;
  }

  async update(
    id: number,
    dto: AboutUsUpdateDto,
    urlId: string,
    file?: Express.Multer.File,
  ) {
    const aboutUs = await this.aboutUsModel.findByPk(id);

    if (!aboutUs) {
      throw new NotFoundException('Room not found');
    }

    let images: string[] = Array.isArray(aboutUs.image)
      ? [...aboutUs.image]
      : [];

    if (file) {
      const targetKey = urlId.startsWith('/') ? urlId.slice(1) : urlId;

      await this.filesService.delete(targetKey);

      images = images.filter((img) => {
        const imgKey = this.filesService.extractKey(img);
        return imgKey !== targetKey;
      });

      const newImg = await this.filesService.upload(file, 'about-us');
      images.push(newImg);
    }

    await aboutUs.update({
      ...dto,
      images,
    });

    return aboutUs;
  }

  async delete(id: number) {
    const aboutUs = await this.aboutUsModel.findOne({ where: { id } });
    await aboutUs.destroy();
    const parsedUrl = new URL(aboutUs.image);
    const pathOnly = parsedUrl.pathname;
    await this.filesService.delete(pathOnly);
    return { message: 'aboutUs successfully deleted' };
  }
}
