import dayjs from 'dayjs';
import { Op, Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { calculatePagination } from '@/shared/utils/calculate.pagination';

import {
  BookingCheckAvailabilityDto,
  CreateBookingDto,
  GetBookingsByDaysDto,
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

  async getBookingsByDays(dto: GetBookingsByDaysDto) {
    const today = dayjs().startOf('day').toDate();

    const bookings = await this.bookingModel.findAll({
      where: {
        category: dto.category,
        status: 'confirmed',
        checkOut: {
          [Op.gte]: today,
        },
      },

      attributes: [
        'id',
        'room_number',
        'check_in',
        'check_out',
        'status',
        'source',
      ],
      order: [['checkIn', 'ASC']],
    });

    return bookings.map((b) => {
      const booking = b.get({ plain: true });
      const dayList = [];

      let current = dayjs(booking.check_in);
      const end = dayjs(booking.check_out);
      if (!current.isValid() || !end.isValid()) {
        return null;
      }

      while (current.isBefore(end) || current.isSame(end, 'day')) {
        dayList.push(current.format('YYYY-MM-DD'));
        current = current.add(1, 'day');
      }

      return {
        id: String(booking.id),
        roomNumber: booking.roomNumber,
        day: dayList,
        status: booking.status,
        source: booking.source,
      };
    });
  }

  async allBookingsAdmin(limit: number, page: number) {
    const total = await this.bookingModel.count();

    const { maxPageCount, offset } = calculatePagination(
      Number(page),
      Number(limit),
      total,
    );
    const bookings = await this.bookingModel.findAll({
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    return {
      data: bookings,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        maxPageCount,
      },
    };
  }

  async findAllOccupied(start: Date, end: Date) {
    return await this.bookingModel.findAll({
      attributes: ['roomId'],
      where: {
        status: {
          [Op.in]: ['confirmed', 'checked_in', 'pending'],
        },
        [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
        checkIn: { [Op.lt]: end },
        checkOut: { [Op.gt]: start },
      },
      raw: true,
    });
  }

  async searchBooking() {}
}
