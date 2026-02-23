import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { Op } from 'sequelize';

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
    transaction?: any,
  ) {
    await this.bookingModel.update(
      { status: 'cancelled' },
      {
        where: {
          status: 'pending',
          expiresAt: { [Op.lt]: new Date() },
        },
        transaction,
      },
    );

    const conflict = await this.bookingModel.findOne({
      where: {
        [entityField]: entityId,
        checkIn: { [Op.lt]: checkOut },
        checkOut: { [Op.gt]: checkIn },
        status: {
          [Op.in]: ['confirmed', 'checked_in'],
        },
      },
      transaction,
    });
    if (conflict) {
      throw new BadRequestException('Already booked for selected dates');
    }
  }

  async createBooking(data: any, transaction?: any) {
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

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
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
}
