import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Sequelize } from 'sequelize';



import { BookingService } from '@/booking/booking.service';
import { LodgeService } from '@/lodge/lodge.service';
import { PaymentService } from '@/payment/payment.service';
import { RoomService } from '@/room/room.service';
import { TicketService } from '@/ticket/ticket.service';



import { LodgeCreatedOrderDto } from './dto/lodgeCreatedOrder.dto';
import { RoomCreatedOrderDto } from './dto/roomCreatedOrder.dto';
import { TicketCreatedOrderDto } from './dto/ticketCreatedOrder.dto';
import { Order } from './entities/order.entity';































































































































dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Moscow');

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order) private orderModel: typeof Order,
		@InjectConnection() private readonly sequelize: Sequelize,
		private paymentService: PaymentService,
		private bookingService: BookingService,
		private readonly roomService: RoomService,
		private readonly lodgeService: LodgeService,
		private readonly ticketService: TicketService,
	) {}

	calculateTotalAmount(
		roomPrice: number,
		startDate: Date,
		endDate: Date,
	): number {
		const start = dayjs(startDate).startOf('day');
		const end = dayjs(endDate).startOf('day');

		const days = Math.max(1, end.diff(start, 'day'));

		return roomPrice * days;
	}

	async roomCreatedOrder(dto: RoomCreatedOrderDto) {
		const transaction = await this.sequelize.transaction();
		try {
			const room = await this.roomService.findById(dto.roomId);

			const total = this.calculateTotalAmount(
				room.price,
				dto.startDate,
				dto.endDate,
			);

			if (dto.member > room.member) {
				throw Error;
			}

			const booking = await this.bookingService.createBooking(
				{
					roomId: room.id,
					totalPrice: total,
					member: dto.member,
					guestName: dto.customerName,
					guestPhone: dto.customerPhone.trim(),
					guestEmail: dto.customerEmail.trim(),
					category: room.category,
					roomNumber: room.roomNumber,
					checkIn: dayjs(dto.startDate).startOf('day').utc().toDate(),
					checkOut: dayjs(dto.endDate).startOf('day').utc().toDate(),
					source: 'online',
				},
				transaction,
			);

			const order = await this.orderModel.create(
				{
					...dto,
					paymentMethod: dto.method,
					status: 'PENDING',
					totalAmount: total,
				},
				{ transaction },
			);

			const payment = await this.paymentService.createPayment(
				{ ...order.get({ plain: true }), bookingIds: [booking.id] },
				dto.method,
			);

			await order.update({ paymentId: payment.paymentId }, { transaction });

			await transaction.commit();

			return { orderId: order.id, paymentUrl: payment.confirmationUrl };
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	}

	async lodgeCreatedOrder(dto: LodgeCreatedOrderDto) {
		const transaction = await this.sequelize.transaction();
		try {
			const lodge = await this.lodgeService.findById(dto.lodgeId);

			const total = this.calculateTotalAmount(
				lodge.price,
				dto.startDate,
				dto.endDate,
			);

			if (dto.member > lodge.member) {
				throw Error;
			}

			const booking = await this.bookingService.createBooking(
				{
					lodgeId: lodge.id,
					totalPrice: total,
					member: dto.member,
					guestName: dto.customerName,
					guestPhone: dto.customerPhone.trim(),
					guestEmail: dto.customerEmail.trim(),
					// roomNumber: lodge.roomNumber,
					checkIn: dayjs(dto.startDate).startOf('day').utc().toDate(),
					checkOut: dayjs(dto.endDate).startOf('day').utc().toDate(),
					source: 'online',
				},
				transaction,
			);

			const order = await this.orderModel.create(
				{
					...dto,
					paymentMethod: dto.method,
					status: 'PENDING',
					totalAmount: total,
				},
				{ transaction },
			);
			const payment = await this.paymentService.createPayment(
				{ ...order.get({ plain: true }), bookingIds: [booking.id] },
				dto.method,
			);

			await order.update({ paymentId: payment.paymentId }, { transaction });
			await transaction.commit();

			return { orderId: order.id, paymentUrl: payment.confirmationUrl };
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	}

	async ticketCreatedOrder(dto: TicketCreatedOrderDto) {
		const transaction = await this.sequelize.transaction();
		try {
			let total = 0;
			const bookingIds: number[] = [];
			for (const item of dto.items) {
				const ticket = await this.ticketService.findById(item.ticketId);
				if (ticket.quantity === 0) {
					throw new NotFoundException('Билеты закончились');
				}

				if (!ticket)
					throw new NotFoundException(`Билет ${item.ticketId} не найден`);

				if (ticket.quantity < item.quantity) {
					throw new BadRequestException(
						`Недостаточно билетов. Осталось: ${ticket.quantity}`,
					);
				}
				total += ticket.finalPrice * item.quantity;
			}

			const order = await this.orderModel.create(
				{
					customerName: dto.customerName.trim(),
					customerEmail: dto.customerEmail.trim(),
					customerPhone: dto.customerPhone.trim(),
					paymentMethod: dto.method,
					status: 'PENDING',
					totalAmount: total,
				},
				{ transaction },
			);

			for (const item of dto.items) {
				const ticket = await this.ticketService.findById(item.ticketId);
				const booking = await this.bookingService.createBooking(
					{
						ticketId: ticket.id,
						orderId: order.id,
						totalPrice: total,
						ticketQuantity: item.quantity,
						guestName: dto.customerName,
						guestPhone: dto.customerPhone.trim(),
						guestEmail: dto.customerEmail.trim(),
						checkIn: dayjs(ticket.date).startOf('day').utc().toDate(),
						checkOut: dayjs(ticket.date).endOf('day').utc().toDate(),
						source: 'online',
					},
					transaction,
				);

				bookingIds.push(booking.id);
			}
			const payment = await this.paymentService.createPayment(
				{ ...order.get({ plain: true }), bookingIds },
				dto.method,
			);

			await order.update({ paymentId: payment.paymentId }, { transaction });

			await transaction.commit();

			return { orderId: order.id, paymentUrl: payment.confirmationUrl };
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	}
}
