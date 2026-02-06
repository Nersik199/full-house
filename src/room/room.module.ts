import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './entities/room.entity';
import { FilesModule } from '@/files/files.module';
import { HeaderRoom } from './entities/header.entity';

@Module({
  imports: [SequelizeModule.forFeature([Room, HeaderRoom]), FilesModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
