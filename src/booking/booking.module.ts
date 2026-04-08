import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { BookingController } from './booking.controller';
import { Ticket } from '@/ticket/entities/ticket.entity';

@Module({
  imports: [SequelizeModule.forFeature([Booking, Ticket])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
