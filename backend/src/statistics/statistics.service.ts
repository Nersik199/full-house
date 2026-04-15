import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { col, fn, Op } from 'sequelize';

import { Booking } from '@/booking/entities/booking.entity';
import { Lodge } from '@/lodge/entities/lodge.entity';
import { Order } from '@/order/entities/order.entity';
import { Room } from '@/room/entities/room.entity';

dayjs.extend(isBetween);

@Injectable()
export class StatisticsService {
	constructor(
		@InjectModel(Order) private readonly orderModel: typeof Order,
		@InjectModel(Booking) private readonly bookingModel: typeof Booking,
		@InjectModel(Room) private readonly roomModel: typeof Room,
		@InjectModel(Lodge) private readonly lodgeModel: typeof Lodge,
	) {}

	async getStatisticHotels(startDate?: string, endDate?: string) {
		const today = dayjs().format('YYYY-MM-DD');

		const whereClause: any = { status: 'SUCCEEDED' };
		if (startDate || endDate) {
			whereClause.createdAt = {};
			if (startDate) whereClause.createdAt[Op.gte] = startDate;
			if (endDate) whereClause.createdAt[Op.lte] = endDate;
		}

		const totalRoomsCount = await this.roomModel.count();

		const bookingsToday = await this.bookingModel.findAll({
			where: {
				status: 'confirmed',
				roomId: { [Op.ne]: null },
				[Op.or]: [
					{ checkIn: { [Op.lte]: today }, checkOut: { [Op.gte]: today } },
					{ checkIn: today },
					{ checkOut: today },
				],
			},
		});

		const arrivals = bookingsToday
			.filter(b => dayjs(b.checkIn).isSame(today, 'day'))
			.reduce((sum, b) => sum + (Number(b.member) || 0), 0);

		const departures = bookingsToday
			.filter(b => dayjs(b.checkOut).isSame(today, 'day'))
			.reduce((sum, b) => sum + (Number(b.member) || 0), 0);

		const inHotel = bookingsToday
			.filter(b => dayjs(today).isBetween(b.checkIn, b.checkOut, 'day', '[]'))
			.reduce((sum, b) => sum + (Number(b.member) || 0), 0);

		const occupiedRoomIds = new Set(
			bookingsToday
				.filter(b => dayjs(today).isBetween(b.checkIn, b.checkOut, 'day', '[]'))
				.map(b => b.roomId),
		);
		const occupiedCount = occupiedRoomIds.size;

		const monthlyRevenue = await this.orderModel.findAll({
			attributes: [
				[fn('date_trunc', 'month', col('createdAt')), 'month'],
				[fn('sum', col('total_amount')), 'revenue'],
			],
			where: whereClause,
			group: [fn('date_trunc', 'month', col('createdAt'))],
			order: [[fn('date_trunc', 'month', col('createdAt')), 'ASC']],
			raw: true,
		});

		return {
			title: 'Статистика отеля',
			today: {
				arrivals,
				departures,
				inHotel,
				totalRooms: totalRoomsCount,
				occupiedRooms: occupiedCount,
				availableRooms: Math.max(0, totalRoomsCount - occupiedCount),
			},
			monthly: monthlyRevenue.map((item: any) => ({
				month: dayjs(item.month).format('YYYY-MM'),
				revenue: Number(item.revenue) || 0,
			})),
		};
	}
	async getStatisticSpa() {
		const today = dayjs().format('YYYY-MM-DD');

		const bookingsToday = await this.bookingModel.findAll({
			where: {
				status: 'confirmed',
				[Op.or]: [
					{ checkIn: { [Op.lte]: today }, checkOut: { [Op.gte]: today } },
					{ checkIn: today },
					{ checkOut: today },
				],
			},
		});

		const arrivals = bookingsToday
			.filter(b => dayjs(b.checkIn).isSame(today, 'day') && b.ticketId)
			.reduce((sum, b) => sum + (Number(b.ticketQuantity) || 0), 0);

		const totalPrice = bookingsToday
			.filter(b => b.ticketId !== null)
			.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

		const hotelGuests = bookingsToday
			.filter(b => b.roomId !== null)
			.reduce((sum, b) => sum + (Number(b.member) || 0), 0);

		const externalVisitors = bookingsToday
			.filter(b => b.lodgeId !== null)
			.reduce((sum, b) => sum + (Number(b.member) || 0), 0);

		return {
			title: 'Статистика посещений в СПА',
			arrivals,
			totalPrice,
			hotelGuests,
			externalVisitors,
		};
	}
	async getStatisticLodge() {
		const dateStr = dayjs().format('YYYY-MM-DD');

		const totalLodgeCount = await this.lodgeModel.count();

		const occupiedCount = await this.bookingModel.count({
			distinct: true,
			col: 'lodgeId',
			where: {
				status: 'confirmed',
				lodgeId: { [Op.ne]: null },
				[Op.and]: [
					{ checkIn: { [Op.lte]: dateStr } },
					{ checkOut: { [Op.gte]: dateStr } },
				],
			},
		});

		const availableCount = totalLodgeCount - occupiedCount;

		return {
			title: 'Обзор домиков',
			stats: {
				occupiedText: `${occupiedCount} из ${totalLodgeCount}`,
				availableText: `${availableCount} из ${totalLodgeCount}`,
				occupiedCount,
				availableCount,
				total: totalLodgeCount,
			},
		};
	}
}
