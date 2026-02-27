import dayjs from 'dayjs';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Room } from './entities/room.entity';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { RoomCreateDto, RoomUpdateDto } from './dto/room.dto';
import { FilesService } from '@/files/files.service';
import { HeaderRoomCreateDto, HeaderRoomUpdateDto } from './dto/header.dto';
import { HeaderRoom } from './entities/header.entity';
import { calculatePagination } from '@/shared/utils/calculate.pagination';
import { BookingService } from '@/booking/booking.service';
import { CreateBookingWalkInDto } from './dto/room.booking.walkIn.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room)
    private roomModel: typeof Room,
    @InjectModel(HeaderRoom)
    private readonly headerModel: typeof HeaderRoom,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly filesService: FilesService,
    private readonly bookingService: BookingService,
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
    let newImg: string;
    if (urlId && file) {
      await this.filesService.delete(urlId);
      newImg = await this.filesService.upload(file, 'header');
    }
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

    const roomNumber = await this.roomModel.findOne({
      where: { roomNumber: dto.roomNumber },
    });

    if (roomNumber) {
      throw new BadRequestException(
        `Этот номер уже существует${dto.roomNumber}`,
      );
    }

    const room = await this.roomModel.create({
      ...dto,
      images: imageUrls,
    });

    return room;
  }

  async findAll(page: number, limit: number) {
    const total = await this.roomModel.count();

    const { maxPageCount, offset } = calculatePagination(
      Number(page),
      Number(limit),
      total,
    );

    const rooms = await this.roomModel.findAll({
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      offset,
    });

    if (!rooms.length) {
      throw new NotFoundException('No rooms found');
    }

    return {
      data: rooms,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        maxPageCount,
      },
    };
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

  async roomBookingWalkIn(dto: CreateBookingWalkInDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const room = await this.findById(dto.roomId);

      const booking = await this.bookingService.bookingWalkIn(
        {
          roomId: room.id,
          guestName: dto.guestName,
          guestPhone: dto.guestPhone.trim(),
          guestEmail: dto.guestEmail.trim(),
          roomNumber: room.roomNumber,
          checkIn: dayjs(dto.checkIn).startOf('day').utc().toDate(),
          checkOut: dayjs(dto.checkOut).startOf('day').utc().toDate(),
          source: 'walk-in',
        },
        transaction,
      );

      await transaction.commit();

      return booking;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async search(
    startDate: Date,
    endDate: Date,
    member?: number,
    bedCount?: number,
  ) {
    //todo
    const data = await this.bookingService.getStartDateAndEndDate(37);
    console.log(data);
    const busyRoomIds = await this.bookingService.searchBooking(
      startDate,
      endDate,
    );
    const availableRooms = await this.roomModel.findAll({
      where: {
        id: { [Op.notIn]: busyRoomIds },
        member: member ? { [Op.gte]: member } : undefined,
        bedCount: bedCount ? { [Op.gte]: bedCount } : undefined,
      },
    });
    return availableRooms;
  }
}
