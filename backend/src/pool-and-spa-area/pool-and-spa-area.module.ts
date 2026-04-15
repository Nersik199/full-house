import { Module } from '@nestjs/common';
import { PoolAndSpaAreaService } from './pool-and-spa-area.service';
import { PoolAndSpaAreaController } from './pool-and-spa-area.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PoolAndSpaAreaHeader } from './entities/header.entity';
import { FilesModule } from '@/files/files.module';
import { PoolSpa } from './entities/pool.and.spa.area.entity';
import { SliderImage } from './entities/slider.images.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([PoolAndSpaAreaHeader, PoolSpa, SliderImage]),
    FilesModule,
  ],
  controllers: [PoolAndSpaAreaController],
  providers: [PoolAndSpaAreaService],
})
export class PoolAndSpaAreaModule {}
