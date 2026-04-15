import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Lodge } from '@/lodge/entities/lodge.entity';
import { Room } from '@/room/entities/room.entity';
import { Ticket } from '@/ticket/entities/ticket.entity';

import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Module({
	imports: [SequelizeModule.forFeature([Booking, Ticket, Room, Lodge])],
	controllers: [BookingController],
	providers: [BookingService],
	exports: [BookingService],
})
export class BookingModule {}
