import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Order } from './entities/order.entity';
import { PaymentService } from '@/payment/payment.service';
import { RoomService } from '@/room/room.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { RoomCreatedOrderDto } from './dto/roomCreatedOrder.dto';
import { LodgeService } from '@/lodge/lodge.service';
import { LodgeCreatedOrderDto } from './dto/lodgeCreatedOrder.dto';
import { BookingService } from '@/booking/booking.service';
import { Sequelize } from 'sequelize';
import { TicketService } from '@/ticket/ticket.service';
import { TicketCreatedOrderDto } from './dto/ticketCreatedOrder.dto';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Moscow');

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectConnection() private readonly sequelize: Sequelize,
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private readonly roomService: RoomService,
    private readonly lodgeService: LodgeService,
    private readonly ticketService: TicketService,
  ) {}

  calculateTotalAmount(
    roomPrice: number,
    startDate: Date,
    endDate: Date,
  ): number {
    const start = dayjs(startDate).startOf('day');
    const end = dayjs(endDate).startOf('day');

    const days = Math.max(1, end.diff(start, 'day'));

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
          guestPhone: dto.customerPhone.trim(),
          guestEmail: dto.customerEmail.trim(),
          category: room.category,
          roomNumber: room.roomNumber,
          checkIn: dayjs(dto.startDate).startOf('day').utc().toDate(),
          checkOut: dayjs(dto.endDate).startOf('day').utc().toDate(),
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
          guestPhone: dto.customerPhone.trim(),
          guestEmail: dto.customerEmail.trim(),
          roomNumber: lodge.roomNumber,
          checkIn: dayjs(dto.startDate).startOf('day').utc().toDate(),
          checkOut: dayjs(dto.endDate).startOf('day').utc().toDate(),
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

  async ticketCreatedOrder(dto: TicketCreatedOrderDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const ticket = await this.ticketService.findById(dto.ticketId);
      const now = dayjs();
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }

      const total = ticket.finalPrice * dto.quantity;
      const order = await this.bookingService.createBooking(
        {
          ticketId: ticket.id,
          guestName: dto.customerName,
          guestPhone: dto.customerPhone.trim(),
          guestEmail: dto.customerEmail.trim(),
          roomNumber: null,
          checkIn: now.startOf('day').toDate(),
          checkOut: now.endOf('day').toDate(),
          source: 'online',
        },
        transaction,
      );
      const createdOrder = await this.orderModel.create(
        {
          ...dto,
          bookingId: order.id,
          paymentMethod: dto.method,
          status: 'PENDING',
          totalAmount: total,
        },
        { transaction },
      );

      const payment = await this.paymentService.createPayment(
        createdOrder,
        dto.method,
      );

      await createdOrder.update(
        { paymentId: payment.paymentId },
        { transaction },
      );
      await transaction.commit();

      return { orderId: createdOrder.id, paymentUrl: payment.confirmationUrl };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getAllStatistic() {
    const statistic = await this.orderModel.findAll();

    return statistic;
  }
}
