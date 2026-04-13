import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Booking } from '@/booking/entities/booking.entity';
import { Lodge } from '@/lodge/entities/lodge.entity';
import { Order } from '@/order/entities/order.entity';
import { Room } from '@/room/entities/room.entity';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
	imports: [SequelizeModule.forFeature([Order, Booking, Room, Lodge])],
	controllers: [StatisticsController],
	providers: [StatisticsService],
})
export class StatisticsModule {}
