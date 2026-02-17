import { Module } from '@nestjs/common';
import { LodgeService } from './lodge.service';
import { LodgeController } from './lodge.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from '@/files/files.module';
import { Lodge } from './entities/lodge.entity';
import { HeaderLodge } from './entities/header.entity';

@Module({
  imports: [SequelizeModule.forFeature([Lodge, HeaderLodge]), FilesModule],
  controllers: [LodgeController],
  providers: [LodgeService],
  exports: [LodgeService],
})
export class LodgeModule {}
