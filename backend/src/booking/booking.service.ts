import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import dayjs from 'dayjs';
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

@Injectable()
export class BookingService {
	constructor(
		@InjectModel(Booking)
		private readonly bookingModel: typeof Booking,
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
		const today = dayjs().startOf('day').toDate();

		let categoryCondition;

		if (dto.category === 'lodge') {
			categoryCondition = {
				[Op.and]: [
					{ lodge_id: { [Op.ne]: null } },
					{
						[Op.or]: [{ category: 'lodge' }, { category: null }],
					},
				],
			};
		} else {
			categoryCondition = { category: dto.category };
		}

		const bookings = await this.bookingModel.findAll({
			where: {
				...categoryCondition,
				status: 'confirmed',
				check_out: {
					[Op.gte]: today,
				},
			},
			attributes: [
				'id',
				'room_number',
				'room_id',
				'lodge_id',
				'check_in',
				'check_out',
				'status',
				'source',
				'category',
			],
			order: [['check_in', 'ASC']],
		});

		return bookings
			.map(b => {
				const booking = b.get({ plain: true });

				let current = dayjs(booking.check_in);
				const end = dayjs(booking.check_out);

				if (!current.isValid() || !end.isValid() || end.isBefore(current)) {
					return null;
				}

				const dayList = [];
				while (current.isSameOrBefore(end, 'day')) {
					dayList.push(current.format('YYYY-MM-DD'));
					current = current.add(1, 'day');
				}

				return {
					id: booking.id,
					roomId: booking.room_id,
					lodgeId: booking.lodge_id,
					roomNumber: booking.room_number,
					day: dayList,
					status: booking.status,
					source: booking.source,
					category: booking.category,
				};
			})
			.filter(Boolean);
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
}
