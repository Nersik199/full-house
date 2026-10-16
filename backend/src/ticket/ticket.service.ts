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

import { CreateTicketDto, UpdateTicketDto } from './dto/CreateTicketDto';
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

	async createTicket(dto: CreateTicketDto) {
		const startDate = dayjs(dto.startDate);

		const endDate = dayjs(dto.endDate);

		if (!startDate.isValid()) {
			throw new BadRequestException('Invalid start date format');
		}

		if (!endDate.isValid()) {
			throw new BadRequestException('Invalid end date format');
		}

		if (endDate.isBefore(startDate, 'day')) {
			throw new BadRequestException(
				'End date cannot be earlier than start date',
			);
		}

		const discountPercent = dto.discount || 0;

		if (discountPercent < 0 || discountPercent > 100) {
			throw new BadRequestException('Discount must be between 0 and 100');
		}

		const finalPrice =
			Math.round(dto.price * (1 - discountPercent / 100) * 100) / 100;

		return await this.ticketModel.create({
			startDate: startDate.format('YYYY-MM-DD'),
			endDate: endDate.format('YYYY-MM-DD'),
			price: dto.price,
			discount: discountPercent,
			finalPrice,
			quantity: dto.quantity,
			title: dto.title,
			description: dto.description,
			subTitle: dto.subTitle,
			features: dto.features,
		});
	}

	async updateTicket(id: number, dto: UpdateTicketDto) {
		const ticket = await this.ticketModel.findByPk(id);

		if (!ticket) {
			throw new NotFoundException('Ticket not found');
		}

		const startDate = dto.startDate
			? dayjs(dto.startDate)
			: dayjs(ticket.startDate);

		const endDate = dto.endDate ? dayjs(dto.endDate) : dayjs(ticket.endDate);

		if (!startDate.isValid()) {
			throw new BadRequestException('Invalid start date format');
		}

		if (!endDate.isValid()) {
			throw new BadRequestException('Invalid end date format');
		}

		if (endDate.isBefore(startDate, 'day')) {
			throw new BadRequestException(
				'End date cannot be earlier than start date',
			);
		}

		const price = dto.price ?? ticket.price;
		const discountPercent = dto.discount ?? ticket.discount ?? 0;

		if (discountPercent < 0 || discountPercent > 100) {
			throw new BadRequestException('Discount must be between 0 and 100');
		}

		const finalPrice =
			Math.round(price * (1 - discountPercent / 100) * 100) / 100;

		await ticket.update({
			startDate: startDate.format('YYYY-MM-DD'),
			endDate: endDate.format('YYYY-MM-DD'),
			price,
			discount: discountPercent,
			finalPrice,
			quantity: dto.quantity ?? ticket.quantity,
			title: dto.title ?? ticket.title,
			description: dto.description ?? ticket.description,
			subTitle: dto.subTitle ?? ticket.subTitle,
			features: dto.features ?? ticket.features,
		});

		return ticket;
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
				['startDate', 'DESC'],
				['endDate', 'DESC'],
				['createdAt', 'DESC'],
			],
			limit: safeLimit,
			offset,
		});

		if (!tickets.length) {
			throw new NotFoundException('Tickets not found');
		}

		return {
			data: tickets,
			meta: {
				total,
				page: safePage,
				limit: safeLimit,
				maxPageCount,
			},
		};
	}

	async getByDaysTickets(date?: string) {
		const targetDate = date ? dayjs(date) : dayjs();

		if (!targetDate.isValid()) {
			throw new BadRequestException('Invalid date format');
		}

		const formattedDate = targetDate.format('YYYY-MM-DD');

		return await this.ticketModel.findAll({
			where: {
				startDate: {
					[Op.lte]: formattedDate,
				},
				endDate: {
					[Op.gte]: formattedDate,
				},
				quantity: {
					[Op.gt]: 0,
				},
			},
			order: [
				['startDate', 'ASC'],
				['endDate', 'ASC'],
				['createdAt', 'DESC'],
			],
		});
	}

	async getAvailableTicketsByIds(ids: number[]) {
		if (!ids || ids.length === 0) {
			return [];
		}

		const endDate = dayjs().startOf('day').toDate();

		return await this.ticketModel.findAll({
			where: {
				id: {
					[Op.in]: ids,
				},
				quantity: {
					[Op.gt]: 0,
				},
				endDate: {
					[Op.gte]: endDate,
				},
			},
		});
	}

	async ticketRemove(id: number) {
		const ticket = await this.ticketModel.findByPk(id);
		if (!ticket) throw new NotFoundException('Ticket not found');

		return await ticket.destroy();
	}
}
