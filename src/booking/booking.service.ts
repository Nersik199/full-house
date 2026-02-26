import dayjs from 'dayjs';
import { Op, Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  BookingCheckAvailabilityDto,
  CreateBookingDto,
} from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
  ) {}

  async checkAvailability(
    dto: BookingCheckAvailabilityDto,
    transaction: Transaction,
  ) {
    const now = dayjs().startOf('day');

    const start = dayjs(dto.checkIn).startOf('day');
    const end = dayjs(dto.checkOut).startOf('day');

    const nights = end.diff(start, 'day');

    if (nights < 1) {
      throw new BadRequestException('Minimum booking is 1 night');
    }
    if (!start.isValid() || !end.isValid())
      throw new BadRequestException('Invalid date');

    if (!start.isBefore(end))
      throw new BadRequestException('Check-in must be before check-out');

    if (start.isBefore(now))
      throw new BadRequestException('Cannot book in the past');

    const conflict = await this.bookingModel.findOne({
      where: {
        [dto.entityField]: dto.entityId,
        status: {
          [Op.in]: ['confirmed', 'checked_in', 'pending'],
        },
        [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
        checkIn: { [Op.lt]: end.toDate() },
        checkOut: { [Op.gt]: start.toDate() },
      },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (conflict)
      throw new BadRequestException('Already booked for selected dates');
  }

  async createBooking(dto: CreateBookingDto, transaction: Transaction) {
    if (dto.roomId) {
      await this.checkAvailability(
        {
          entityField: 'roomId',
          entityId: dto.roomId,
          checkIn: new Date(dto.checkIn),
          checkOut: new Date(dto.checkOut),
        },
        transaction,
      );
    }

    if (dto.lodgeId) {
      await this.checkAvailability(
        {
          entityField: 'lodgeId',
          entityId: dto.lodgeId,
          checkIn: new Date(dto.checkIn),
          checkOut: new Date(dto.checkOut),
        },
        transaction,
      );
    }

    const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

    return this.bookingModel.create(
      {
        ...dto,
        status: 'pending',
        expiresAt,
      },
      { transaction },
    );
  }

  async confirmBooking(id: number) {
    return this.bookingModel.update(
      {
        status: 'confirmed',
        expiresAt: null,
      },
      { where: { id } },
    );
  }

  async cancelBooking(id: number) {
    return this.bookingModel.update(
      {
        status: 'cancelled',
        expiresAt: null,
      },
      { where: { id } },
    );
  }

  async findOne(id: number) {
    return await this.bookingModel.findByPk(id);
  }

  async bookingWalkIn(dto: CreateBookingDto, transaction: Transaction) {
    if (dto.roomId) {
      await this.checkAvailability(
        {
          entityField: 'roomId',
          entityId: dto.roomId,
          checkIn: new Date(dto.checkIn),
          checkOut: new Date(dto.checkOut),
        },
        transaction,
      );
    }

    if (dto.lodgeId) {
      await this.checkAvailability(
        {
          entityField: 'lodgeId',
          entityId: dto.lodgeId,
          checkIn: new Date(dto.checkIn),
          checkOut: new Date(dto.checkOut),
        },
        transaction,
      );
    }

    return await this.bookingModel.create(
      {
        ...dto,
        status: 'confirmed',
        expiresAt: null,
      },
      { transaction },
    );
  }
  async getStartDateAndEndDate() {
    const bookings = await this.bookingModel.findAll({
      where: {
        status: {
          [Op.in]: ['confirmed', 'checked_in'],
        },
      },
      attributes: ['checkIn', 'checkOut', 'roomId'],
    });

    return bookings.map((b) => ({
      roomId: b.roomId,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
    }));
  }

  async searchBooking(startDate: Date, endDate: Date) {
    const start = dayjs(startDate).startOf('day').toDate();
    const end = dayjs(endDate).startOf('day').toDate();

    const busyRooms = await this.bookingModel.findAll({
      where: {
        status: {
          [Op.in]: ['confirmed', 'checked_in'],
        },
        [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
        checkIn: { [Op.lt]: end },
        checkOut: { [Op.gt]: start },
      },
      attributes: ['roomId'],
    });
    const busyRoomIds = busyRooms.map((b) => b.roomId).filter(Boolean);
    return busyRoomIds;
  }
}
