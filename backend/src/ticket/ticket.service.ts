import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

import { FilesService } from '@/files/files.service';
import { calculatePagination } from '@/shared/utils/calculate.pagination';

import { CreateTicketDto } from './dto/CreateTicketDto';
import { HeaderTicketCreateDto, HeaderTicketUpdateDto } from './dto/header.dto';
import { TicketHeader } from './entities/header.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketService {
	constructor(
		@InjectModel(Ticket) private readonly ticketModel: typeof Ticket,
		@InjectModel(TicketHeader)
		private readonly headerModel: typeof TicketHeader,
		private readonly filesService: FilesService,
	) {}

	async findById(id: number) {
		const ticket = await this.ticketModel.findByPk(id);
		if (!ticket) {
			throw new NotFoundException('Ticket not found');
		}
		return ticket;
	}

	async createHeader(dto: HeaderTicketCreateDto, file?: Express.Multer.File) {
		const uploaded = await this.filesService.upload(file, 'header');

		const headerData = await this.headerModel.create({
			...dto,
			image: uploaded,
		});

		return headerData;
	}

	async getHeader() {
		const getHeader = await this.headerModel.findOne({
			where: { id: 1 },
		});
		if (!getHeader) {
			throw new NotFoundException('header info not found');
		}
		return getHeader;
	}

	async updateHeader(
		id: number,
		dto: HeaderTicketUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const header = await this.headerModel.findByPk(id);
		if (!header) {
			throw new NotFoundException('Ticket item not found');
		}

		const updateData: any = { ...dto };

		if (file && urlId) {
			try {
				const targetKey = this.filesService.extractKey(urlId);
				await this.filesService.delete(targetKey);

				const newImg = await this.filesService.upload(file, 'header');

				updateData.image = newImg;
			} catch (error) {
				console.error('File update error:', error);
			}
		}

		await header.update(updateData);

		return header;
	}

	async setTicketsForDate(dto: CreateTicketDto) {
		if (!dayjs(dto.date).isValid()) {
			throw new BadRequestException('Invalid date format');
		}

		const targetDate = dayjs(dto.date).format('YYYY-MM-DD');
		const discountPercent = dto.discount || 0;

		if (discountPercent < 0 || discountPercent > 100) {
			throw new BadRequestException('Discount must be between 0 and 100');
		}

		const finalPrice =
			Math.round(dto.price * (1 - discountPercent / 100) * 100) / 100;

		const ticketData = {
			date: targetDate,
			price: dto.price,
			discount: discountPercent,
			finalPrice: finalPrice || dto.price,
			quantity: dto.quantity,
		};

		return await this.ticketModel.create(ticketData);
	}

	async getByDaysTickets(date?: string) {
		const baseDate = date ? dayjs(date) : dayjs();

		const start = baseDate.startOf('day').toDate();
		const end = baseDate.endOf('day').toDate();

		return await this.ticketModel.findAll({
			where: {
				date: {
					[Op.between]: [start, end],
				},
			},
			order: [['date', 'ASC']],
		});
	}

	async updateQuantity(id: number, quantitySold: number) {
		const ticket = await this.findById(id);

		if (!ticket) throw new NotFoundException('Ticket not found');

		if (ticket.quantity < quantitySold) {
			throw new BadRequestException('Not enough tickets available');
		}

		const newQuantity = ticket.quantity - quantitySold;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [updatedCount, [updatedTicket]] = await this.ticketModel.update(
			{ quantity: newQuantity },
			{
				where: { id },
				returning: true,
			},
		);

		return updatedTicket;
	}

	async getAllTickets(page: number, limit: number) {
		const total = await this.ticketModel.count();

		const safePage = Number(page) > 0 ? Number(page) : 1;
		const safeLimit = Number(limit) > 0 ? Number(limit) : 10;

		const { maxPageCount, offset } = calculatePagination(
			safePage,
			safeLimit,
			total,
		);

		const tickets = await this.ticketModel.findAll({
			order: [
				['date', 'DESC'],
				['createdAt', 'DESC'],
			],
			limit: safeLimit,
			offset,
		});

		if (!tickets.length) {
			throw new NotFoundException('Tickets not found');
		}

		const groupedData = tickets.reduce(
			(acc, ticket) => {
				const dateKey = dayjs(ticket.date).format('YYYY-MM-DD');

				if (!acc[dateKey]) {
					acc[dateKey] = [];
				}

				acc[dateKey].push(ticket);

				return acc;
			},
			{} as Record<string, any[]>,
		);

		return {
			data: groupedData,
			meta: {
				total,
				page: safePage,
				limit: safeLimit,
				maxPageCount,
			},
		};
	}

	async getAvailableTicketsByIds(ids: number[]) {
		if (!ids || ids.length === 0) {
			return [];
		}

		const startOfToday = dayjs().startOf('day').toDate();
		const startOfTomorrow = dayjs().add(1, 'day').startOf('day').toDate();

		const tickets = await this.ticketModel.findAll({
			where: {
				id: {
					[Op.in]: ids,
				},
				quantity: {
					[Op.gt]: 0,
				},
				date: {
					[Op.gte]: startOfToday,
					[Op.lt]: startOfTomorrow,
				},
			},
		});

		return tickets;
	}

	async ticketRemove(id: number) {
		const ticket = await this.ticketModel.findByPk(id);
		if (!ticket) throw new NotFoundException('Ticket not found');

		return await ticket.destroy();
	}
}
