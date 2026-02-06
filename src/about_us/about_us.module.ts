import { Module } from '@nestjs/common';
import { AboutUsService } from './about_us.service';
import { AboutUsController } from './about_us.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AboutUs } from './entities/about_us.entity';
import { FilesModule } from '@/files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([AboutUs]), FilesModule],
  controllers: [AboutUsController],
  providers: [AboutUsService],
})
export class AboutUsModule {}
