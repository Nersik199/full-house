import { PaymentService } from '@/payment/payment.service';
import { RoomService } from '@/room/room.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { RoomCreatedOrderDto } from './dto/roomCreatedOrder.dto';
import dayjs from 'dayjs';
import { LodgeService } from '@/lodge/lodge.service';
import { LodgeCreatedOrderDto } from './dto/lodgeCreatedOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    private paymentService: PaymentService,
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

  async roomCreatedOrder(
    dto: RoomCreatedOrderDto,
  ): Promise<{ orderId: number; paymentUrl: string } | undefined> {
    const room = await this.roomService.findById(dto.roomId);
    const total = this.calculateTotalAmount(
      room.price,
      dto.startDate,
      dto.endDate,
    );
    const order = await this.orderModel.create({
      ...dto,
      roomId: room.id,
      roomNumber: room.roomNumber,
      paymentMethod: dto.method,
      status: 'PENDING',
      totalAmount: total,
    });

    const payment = await this.paymentService.createPayment(order, dto.method);

    await order.update({ paymentId: payment.paymentId });

    return { orderId: order.id, paymentUrl: payment.confirmationUrl };
  }

  async lodgeCreatedOrder(
    dto: LodgeCreatedOrderDto,
  ): Promise<{ orderId: number; paymentUrl: string } | undefined> {
    const lodge = await this.lodgeService.findById(dto.lodgeId);
    const total = this.calculateTotalAmount(
      lodge.price,
      dto.startDate,
      dto.endDate,
    );
    const order = await this.orderModel.create({
      ...dto,
      lodgeId: lodge.id,
      roomNumber: lodge.roomNumber,
      paymentMethod: dto.method,
      status: 'PENDING',
      totalAmount: total,
    });

    const payment = await this.paymentService.createPayment(order, dto.method);

    await order.update({ paymentId: payment.paymentId });

    return { orderId: order.id, paymentUrl: payment.confirmationUrl };
  }
}
