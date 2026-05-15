import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Op, Transaction } from 'sequelize';

import { Lodge } from '@/lodge/entities/lodge.entity';
import { Room } from '@/room/entities/room.entity';
import { calculatePagination } from '@/shared/utils/calculate.pagination';
import { Ticket } from '@/ticket/entities/ticket.entity';

import {
	BookingCheckAvailabilityDto,
	CreateBookingDto,
	GetAllBookings,
	GetBookingsByDaysDto,
} from './dto/booking.dto';
import { Booking } from './entities/booking.entity';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

@Injectable()
export class BookingService {
	constructor(
		@InjectModel(Booking)
		private readonly bookingModel: typeof Booking,
		@InjectModel(Room)
		private roomModel: typeof Room,
		@InjectModel(Lodge)
		private lodgeModel: typeof Lodge,
	) {}

	async checkAvailability(
		dto: BookingCheckAvailabilityDto,
		transaction: Transaction,
	) {
		if (dto.entityField === 'ticketId') {
			if (dayjs(dto.checkIn).isBefore(dayjs().startOf('day'))) {
				throw new BadRequestException('Cannot book in the past');
			}
			return;
		}
		const now = dayjs().startOf('day');

		const start = dayjs(dto.checkIn).startOf('day');
		const end = dayjs(dto.checkOut).startOf('day');

		const nights = end.diff(start, 'day');

		if (nights < 1) {
			throw new BadRequestException('Minimum booking is 1 night');
		}
		if (!start.isValid() || !end.isValid())
			throw new BadRequestException('Invalid date');

		if (!start.isBefore(end))
			throw new BadRequestException('Check-in must be before check-out');

		if (start.isBefore(now))
			throw new BadRequestException('Cannot book in the past');

		const conflict = await this.bookingModel.findOne({
			where: {
				[dto.entityField]: dto.entityId,
				status: {
					[Op.in]: ['confirmed', 'checked_in'],
				},
				[Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
				checkIn: { [Op.lt]: end.toDate() },
				checkOut: { [Op.gt]: start.toDate() },
			},
			lock: transaction.LOCK.UPDATE,
			transaction,
		});

		if (conflict)
			throw new BadRequestException('Already booked for selected dates');
	}

	async createBooking(dto: CreateBookingDto, transaction: Transaction) {
		if (dto.roomId) {
			await this.checkAvailability(
				{
					entityField: 'roomId',
					entityId: dto.roomId,
					checkIn: new Date(dto.checkIn),
					checkOut: new Date(dto.checkOut),
				},
				transaction,
			);
		}

		if (dto.lodgeId) {
			await this.checkAvailability(
				{
					entityField: 'lodgeId',
					entityId: dto.lodgeId,
					checkIn: new Date(dto.checkIn),
					checkOut: new Date(dto.checkOut),
				},
				transaction,
			);
		}

		if (dto.ticketId) {
			await this.checkAvailability(
				{
					entityField: 'ticketId',
					entityId: dto.ticketId,
					ticketQuantity: dto.ticketQuantity,
					checkIn: new Date(dto.checkIn),
					checkOut: new Date(dto.checkOut),
				},
				transaction,
			);
		}

		const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

		return this.bookingModel.create(
			{
				...dto,
				status: 'pending',
				expiresAt,
			},
			{ transaction },
		);
	}

	async confirmBooking(id: number) {
		return this.bookingModel.update(
			{
				status: 'confirmed',
				expiresAt: null,
			},
			{ where: { id } },
		);
	}

	async cancelBooking(id: number) {
		return this.bookingModel.update(
			{
				status: 'cancelled',
				expiresAt: null,
			},
			{ where: { id } },
		);
	}

	async findOne(id: number) {
		return await this.bookingModel.findByPk(id);
	}

	async bookingWalkIn(dto: CreateBookingDto, transaction: Transaction) {
		if (dto.roomId) {
			await this.checkAvailability(
				{
					entityField: 'roomId',
					entityId: dto.roomId,
					checkIn: new Date(dto.checkIn),
					checkOut: new Date(dto.checkOut),
				},
				transaction,
			);
		}

		if (dto.lodgeId) {
			await this.checkAvailability(
				{
					entityField: 'lodgeId',
					entityId: dto.lodgeId,
					checkIn: new Date(dto.checkIn),
					checkOut: new Date(dto.checkOut),
				},
				transaction,
			);
		}

		return await this.bookingModel.create(
			{
				...dto,
				status: 'confirmed',
				expiresAt: null,
			},
			{ transaction },
		);
	}

	async getBookingsByDays(dto: GetBookingsByDaysDto) {
		const startDate = dayjs().startOf('day');
		const endDate = startDate.add(2, 'month').endOf('day');

		const rangeDates: string[] = [];
		let tmpDate = startDate;
		while (tmpDate.isSameOrBefore(endDate, 'day')) {
			rangeDates.push(tmpDate.format('YYYY-MM-DD'));
			tmpDate = tmpDate.add(1, 'day');
		}

		const bookingInclude = {
			model: this.bookingModel,
			as: 'bookings',
			where: {
				status: 'confirmed',
				[Op.or]: [
					{ checkIn: { [Op.between]: [startDate.toDate(), endDate.toDate()] } },
					{
						checkOut: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
					},
				],
			},
			required: false,
		};

		let rooms = [];
		let lodges = [];

		if (dto.category !== 'lodge') {
			rooms = await this.roomModel.findAll({
				where: { category: dto.category },
				attributes: ['id', 'roomNumber', 'category', 'price'],
				include: [bookingInclude],
			});
		}

		if (dto.category === 'lodge' || !dto.category) {
			lodges = await this.lodgeModel.findAll({
				attributes: ['id', 'roomNumber', 'price'],
				include: [bookingInclude],
			});
		}

		const processAccommodation = (
			item: { get: (arg0: { plain: boolean }) => any },
			isLodge = false,
		) => {
			const plainItem = item.get({ plain: true });
			const bookings = plainItem.bookings || [];

			const timeline = rangeDates.map(dateStr => {
				const currentDay = dayjs(dateStr);

				const foundBooking = bookings.find(b => {
					const start = dayjs(b.checkIn);
					const end = dayjs(b.checkOut);
					return (
						currentDay.isSameOrAfter(start, 'day') &&
						currentDay.isBefore(end, 'day')
					);
				});

				if (foundBooking) {
					return {
						date: dateStr,
						status: 'occupied',
						title: 'Занято',
						bookingId: foundBooking.id,
					};
				}

				return {
					date: dateStr,
					status: 'free',
					price: plainItem.price || 8000,
					title: `${plainItem.price || 8000} ₽`,
				};
			});

			return {
				id: plainItem.id,
				roomNumber: plainItem.roomNumber || plainItem.title,
				category: plainItem.category,
				isLodge,
				timeline,
			};
		};

		const formattedRooms = rooms.map(r => processAccommodation(r, false));
		const formattedLodges = lodges.map(l => processAccommodation(l, true));

		return {
			days: rangeDates,
			data: [...formattedRooms, ...formattedLodges],
		};
	}

	async allBookingsAdmin(limit: number, page: number, dto: GetAllBookings) {
		const whereClause: any = {};

		if (dto.type === 'room') {
			whereClause.roomId = { [Op.ne]: null };
		} else if (dto.type === 'ticket') {
			whereClause.ticketId = { [Op.ne]: null };
		} else if (dto.type === 'lodge') {
			whereClause.lodgeId = { [Op.ne]: null };
		}

		if (dto.query) {
			whereClause[Op.or] = [
				{ guestName: { [Op.iLike]: `%${dto.query}%` } },
				{ guestPhone: { [Op.iLike]: `%${dto.query}%` } },
				{ guestEmail: { [Op.iLike]: `%${dto.query}%` } },
			];
		}

		const total = await this.bookingModel.count({ where: whereClause });

		const { maxPageCount, offset } = calculatePagination(
			Number(page),
			Number(limit),
			total,
		);

		const bookings = await this.bookingModel.findAll({
			where: whereClause,
			order: [['createdAt', 'DESC']],
			limit: Number(limit),
			offset,
			include: [
				{
					model: Ticket,
				},
				{
					model: Room,
					attributes: ['id', 'room_number'],
				},
				{
					model: Lodge,
					attributes: ['id', 'room_number'],
				},
			],
		});

		return {
			data: bookings,
			meta: {
				total,
				page: Number(page),
				limit: Number(limit),
				maxPageCount,
			},
		};
	}

	async findAllOccupied(start: Date, end: Date) {
		return await this.bookingModel.findAll({
			attributes: ['room_id'],
			where: {
				status: {
					[Op.in]: ['confirmed', 'checked_in', 'pending'],
				},
				[Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
				checkIn: { [Op.lt]: end },
				checkOut: { [Op.gt]: start },
			},
			raw: true,
		});
	}

	async findAllOccupiedForSearch(start: Date, end: Date) {
		return await this.bookingModel.findAll({
			where: {
				status: { [Op.ne]: 'cancelled' },
				[Op.or]: [
					{
						check_in: { [Op.lt]: end },
						check_out: { [Op.gt]: start },
					},
				],
			},
			attributes: ['room_id'],
		});
	}
}
