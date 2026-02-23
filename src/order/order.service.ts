import dayjs from 'dayjs';
import { PaymentService } from '@/payment/payment.service';
import { RoomService } from '@/room/room.service';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { RoomCreatedOrderDto } from './dto/roomCreatedOrder.dto';
import { LodgeService } from '@/lodge/lodge.service';
import { LodgeCreatedOrderDto } from './dto/lodgeCreatedOrder.dto';
import { BookingService } from '@/booking/booking.service';
import { Sequelize } from 'sequelize';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectConnection() private readonly sequelize: Sequelize,
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private readonly roomService: RoomService,
    private readonly lodgeService: LodgeService,
  ) {}

  calculateTotalAmount(
    roomPrice: number,
    startDate: Date,
    endDate: Date,
  ): number {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const hours = end.diff(start, 'hour');

    const days = Math.max(1, Math.ceil(hours / 24));

    return roomPrice * days;
  }

  async roomCreatedOrder(dto: RoomCreatedOrderDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const room = await this.roomService.findById(dto.roomId);

      const total = this.calculateTotalAmount(
        room.price,
        dto.startDate,
        dto.endDate,
      );

      const booking = await this.bookingService.createBooking(
        {
          roomId: room.id,
          guestName: dto.customerName,
          guestPhone: dto.customerPhone,
          guestEmail: dto.customerEmail,
          roomNumber: room.roomNumber,
          checkIn: dto.startDate,
          checkOut: dto.endDate,
          source: 'online',
        },
        transaction,
      );

      const order = await this.orderModel.create(
        {
          ...dto,
          bookingId: booking.id,
          paymentMethod: dto.method,
          status: 'PENDING',
          totalAmount: total,
        },
        { transaction },
      );

      const payment = await this.paymentService.createPayment(
        order,
        dto.method,
      );

      await order.update({ paymentId: payment.paymentId }, { transaction });

      await transaction.commit();

      return { orderId: order.id, paymentUrl: payment.confirmationUrl };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async lodgeCreatedOrder(dto: LodgeCreatedOrderDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const lodge = await this.lodgeService.findById(dto.lodgeId);

      const total = this.calculateTotalAmount(
        lodge.price,
        dto.startDate,
        dto.endDate,
      );

      const booking = await this.bookingService.createBooking(
        {
          lodgeId: lodge.id,
          guestName: dto.customerName,
          guestPhone: dto.customerPhone,
          guestEmail: dto.customerEmail,
          roomNumber: lodge.roomNumber,
          checkIn: dto.startDate,
          checkOut: dto.endDate,
          source: 'online',
        },
        transaction,
      );

      const order = await this.orderModel.create(
        {
          ...dto,
          bookingId: booking.id,
          paymentMethod: dto.method,
          status: 'PENDING',
          totalAmount: total,
        },
        { transaction },
      );
      const payment = await this.paymentService.createPayment(
        order,
        dto.method,
      );

      await order.update({ paymentId: payment.paymentId }, { transaction });
      await transaction.commit();

      return { orderId: order.id, paymentUrl: payment.confirmationUrl };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
