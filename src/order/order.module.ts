import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RoomModule } from '@/room/room.module';
import { PaymentModule } from '@/payment/payment.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { LodgeModule } from '@/lodge/lodge.module';
import { BookingModule } from '@/booking/booking.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Order]),
    BookingModule,
    RoomModule,
    LodgeModule,
    PaymentModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
