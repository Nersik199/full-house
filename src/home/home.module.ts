import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { HeaderHome } from './entities/header.entity';
import { FilesModule } from '@/files/files.module';
import { Home } from './entities/home.entity';

@Module({
  imports: [SequelizeModule.forFeature([Home, HeaderHome]), FilesModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
