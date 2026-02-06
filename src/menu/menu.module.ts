import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from '@/files/files.module';
import { Menu } from './entities/menu.entity';
import { HeaderMenu } from './entities/header.entity';

@Module({
  imports: [SequelizeModule.forFeature([Menu, HeaderMenu]), FilesModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
