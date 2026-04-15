import { Module } from '@nestjs/common';
import { AboutUsService } from './about_us.service';
import { AboutUsController } from './about_us.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AboutUs } from './entities/about_us.entity';
import { FilesModule } from '@/files/files.module';
import { AboutUsHeader } from './entities/about_us.header.entity';

@Module({
  imports: [SequelizeModule.forFeature([AboutUs, AboutUsHeader]), FilesModule],
  controllers: [AboutUsController],
  providers: [AboutUsService],
})
export class AboutUsModule {}
