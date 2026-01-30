import { Injectable, NotFoundException } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { InjectModel } from '@nestjs/sequelize';
import { RoomCreateDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room)
    private roomModel: typeof Room,
  ) {}

  async create(dto: RoomCreateDto) {
    const { name, description, price, wifi, Bathroom } = dto;
    const room = await this.roomModel.create({
      name,
      description,
      price,
      wifi,
      Bathroom,
    });
    return room;
  }

  async findAll() {
    const rooms = await this.roomModel.findAll({
      order: [['created_at', 'DESC']],
    });

    if (!rooms || rooms.length === 0) {
      throw new NotFoundException('No rooms found');
    }

    return rooms;
  }

  async findById(id: number) {
    const room = await this.roomModel.findByPk(id);
    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return room;
  }

  async update(id: number, dto: Partial<RoomCreateDto>) {
    const room = await this.findById(id);
    await room.update(dto);
    return room;
  }

  async delete(id: number) {
    const room = await this.findById(id);
    await room.destroy();
    return { message: 'Room successfully deleted' };
  }
}
