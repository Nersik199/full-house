import { Injectable } from '@nestjs/common';
import { AboutUs } from './entities/about_us.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from '@/files/files.service';
import { AboutUsCreateDto } from './dto/about_us.createDto';

@Injectable()
export class AboutUsService {
  constructor(
    @InjectModel(AboutUs)
    private readonly aboutUsModel: typeof AboutUs,
    private readonly filesService: FilesService,
  ) {}

  async create(dto: AboutUsCreateDto, file?: Express.Multer.File) {
    try {
      const { title, subTitle, description } = dto;
      const data = await this.aboutUsModel.create({
        title,
        subTitle,
        description,
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
