import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { Op, Transaction } from 'sequelize';
import dayjs from 'dayjs';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
  ) {}

  async checkAvailability(
    entityField: 'roomId' | 'lodgeId',
    entityId: number,
    checkIn: Date,
    checkOut: Date,
    transaction: Transaction,
  ) {
    const now = dayjs().startOf('day');

    const start = dayjs(checkIn).startOf('day');
    const end = dayjs(checkOut).startOf('day');

    if (!start.isValid() || !end.isValid())
      throw new BadRequestException('Invalid date');

    if (!start.isBefore(end))
      throw new BadRequestException('Check-in must be before check-out');

    if (start.isBefore(now))
      throw new BadRequestException('Cannot book in the past');

    const conflict = await this.bookingModel.findOne({
      where: {
        [entityField]: entityId,
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
  async createBooking(data: any, transaction?: Transaction) {
    if (data.roomId || data.lodgeId)
      throw new BadRequestException('Choose room OR lodge');

    if (data.roomId) {
      await this.checkAvailability(
        'roomId',
        data.roomId,
        new Date(data.checkIn),
        new Date(data.checkOut),
        transaction,
      );
    }

    if (data.lodgeId) {
      await this.checkAvailability(
        'lodgeId',
        data.lodgeId,
        new Date(data.checkIn),
        new Date(data.checkOut),
        transaction,
      );
    }

    const expiresAt = new Date(Date.now() + 20 * 60 * 1000);
    return this.bookingModel.create(
      {
        ...data,
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
}
