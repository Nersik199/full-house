import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [SequelizeModule.forFeature([Booking])],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
