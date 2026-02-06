import { Injectable, NotFoundException } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { InjectModel } from '@nestjs/sequelize';
import { RoomCreateDto, RoomUpdateDto } from './dto/room.dto';
import { FilesService } from '@/files/files.service';
import { HeaderRoomCreateDto, HeaderRoomUpdateDto } from './dto/header.dto';
import { HeaderRoom } from './entities/header.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room)
    private roomModel: typeof Room,
    @InjectModel(HeaderRoom)
    private readonly headerModel: typeof HeaderRoom,
    private readonly filesService: FilesService,
  ) {}

  async createHeader(dto: HeaderRoomCreateDto, file?: Express.Multer.File) {
    const uploaded = await this.filesService.upload(file, 'header');

    const headerData = await this.headerModel.create({
      ...dto,
      image: uploaded,
    });

    return headerData;
  }

  async getHeader() {
    const getHeader = await this.headerModel.findAll();
    if (!getHeader) {
      throw new NotFoundException('header info not found');
    }
    return getHeader;
  }

  async updateHeader(
    id: number,
    urlId: string,
    dto: HeaderRoomUpdateDto,
    file?: Express.Multer.File,
  ) {
    await this.filesService.delete(urlId);
    const newImg = await this.filesService.upload(file, 'header');
    const [updatedCount, [updatedHeader]] = await this.headerModel.update(
      { ...dto, image: newImg },
      {
        where: { id },
        returning: true,
      },
    );

    if (updatedCount === 0) throw new NotFoundException('Room not found');

    return updatedHeader;
  }

  async create(dto: RoomCreateDto, files?: Express.Multer.File[]) {
    const imageUrls = await this.filesService.uploadMany(files, 'rooms');

    const room = await this.roomModel.create({
      ...dto,
      images: imageUrls,
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

  async update(
    id: number,
    dto: RoomUpdateDto,
    urlId: string,
    file?: Express.Multer.File,
  ) {
    const room = await this.roomModel.findByPk(id);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    let images: string[] = Array.isArray(room.images) ? [...room.images] : [];

    if (file) {
      const targetKey = urlId.startsWith('/') ? urlId.slice(1) : urlId;

      await this.filesService.delete(targetKey);

      images = images.filter((img) => {
        const imgKey = this.filesService.extractKey(img);
        return imgKey !== targetKey;
      });

      const newImg = await this.filesService.upload(file, 'rooms');
      images.push(newImg);
    }

    await room.update({
      ...dto,
      images,
    });

    return room;
  }

  async delete(id: number) {
    const room = await this.roomModel.findOne({ where: { id } });

    const image: string[] = Array.isArray(room.images) ? [...room.images] : [];

    image.forEach(async (img) => {
      const parsedUrl = new URL(img);

      const pathOnly = parsedUrl.pathname;
      await this.filesService.delete(pathOnly);
    });

    await room.destroy();
    return { message: 'Room successfully deleted' };
  }
}
