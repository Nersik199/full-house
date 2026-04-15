import { Module } from '@nestjs/common';
import { DiningRoomService } from './dining_room.service';
import { DiningRoomController } from './dining_room.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from '@/files/files.module';
import { DiningRoom } from './entities/dining_room.entity';
import { DiningRoomHeader } from './entities/dining_room.header.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([DiningRoom, DiningRoomHeader]),
    FilesModule,
  ],
  controllers: [DiningRoomController],
  providers: [DiningRoomService],
})
export class DiningRoomModule {}
