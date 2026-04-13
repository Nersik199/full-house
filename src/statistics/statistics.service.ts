import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import dayjs from 'dayjs';
import { col, fn, Op } from 'sequelize';

import { Booking } from '@/booking/entities/booking.entity';
import { Lodge } from '@/lodge/entities/lodge.entity';
import { Order } from '@/order/entities/order.entity';
import { Room } from '@/room/entities/room.entity';

@Injectable()
export class StatisticsService {
	constructor(
		@InjectModel(Order) private readonly orderModel: typeof Order,
		@InjectModel(Booking) private readonly bookingModel: typeof Booking,
		@InjectModel(Room) private readonly roomModel: typeof Room,
		@InjectModel(Lodge) private readonly lodgeModel: typeof Lodge,
	) {}

	async getAllStatistics(startDate?: string, endDate?: string) {
		const today = new Date().toISOString().split('T')[0];
		if (!startDate || !endDate) {
			startDate = dayjs().startOf('year').toISOString();
			endDate = dayjs().endOf('year').toISOString();
		}
		const totalRoomsCount = await this.roomModel.count();
		const arrivalsToday = await this.bookingModel.aggregate('member', 'sum', {
			where: {
				status: 'confirmed',
				[Op.and]: [
					this.bookingModel.sequelize.where(fn('date', col('check_in')), today),
				],
			},
		});

		const departuresToday = await this.bookingModel.aggregate('member', 'sum', {
			where: {
				status: 'confirmed',
				[Op.and]: [
					this.bookingModel.sequelize.where(
						fn('date', col('check_out')),
						today,
					),
				],
			},
		});

		const inHotel = await this.bookingModel.aggregate('member', 'sum', {
			where: {
				status: 'confirmed',
				checkIn: { [Op.lte]: today },
				checkOut: { [Op.gte]: today },
			},
		});

		const occupiedRoomsCount = await this.bookingModel.count({
			distinct: true,
			col: 'roomId',
			where: {
				status: 'confirmed',
				checkIn: { [Op.lte]: today },
				checkOut: { [Op.gte]: today },
			},
		});

		const revenueByMonth = await this.orderModel.findAll({
			attributes: [
				[fn('date_trunc', 'month', col('start_date')), 'month'],
				[fn('sum', col('total_amount')), 'revenue'],
			],
			where: {
				status: 'SUCCEEDED',
				createdAt: {
					[Op.between]: [startDate, endDate],
				},
			},
			group: [fn('date_trunc', 'month', col('createdAt'))],
			order: [[fn('date_trunc', 'month', col('createdAt')), 'ASC']],
		});

		return {
			today: {
				arrivals: arrivalsToday,
				departures: departuresToday,
				inHotel: inHotel,
				availableNumber: Number(totalRoomsCount) - Number(occupiedRoomsCount),
				occupiedRooms: occupiedRoomsCount,
			},
			revenueByMonth,
		};
	}
}
