import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './entities/booking.entity';
import { BookingController } from './booking.controller';

@Module({
  imports: [SequelizeModule.forFeature([Booking])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
