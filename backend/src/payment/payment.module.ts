import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './ payments.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { YookassaModule } from 'nestjs-yookassa';
import { getYookassaConfig } from '@/config/loaders/yookassa.config-loader';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from '@/order/entities/order.entity';
import { RoomModule } from '@/room/room.module';
import { LodgeModule } from '@/lodge/lodge.module';
import { BookingModule } from '@/booking/booking.module';
import { TicketModule } from '@/ticket/ticket.module';

@Module({
  controllers: [PaymentController],
  imports: [
    SequelizeModule.forFeature([Order]),
    ConfigModule.forRoot(),
    YookassaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getYookassaConfig,
      inject: [ConfigService],
    }),
    RoomModule,
    LodgeModule,
    BookingModule,
    TicketModule,
  ],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
