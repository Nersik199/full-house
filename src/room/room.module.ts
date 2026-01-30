import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './entities/room.entity';

@Module({
  imports: [SequelizeModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
