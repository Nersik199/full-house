import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import dayjs from 'dayjs';
import { Sequelize } from 'sequelize-typescript';

import { BookingService } from '@/booking/booking.service';
import { FilesService } from '@/files/files.service';
import { CreateBookingWalkInLodgeDto } from '@/lodge/dto/lodge.booking.walkIn.dto';
import { calculatePagination } from '@/shared/utils/calculate.pagination';

import { HeaderLodgeCreateDto, HeaderLodgeUpdateDto } from './dto/header.dto';
import { LodgeCreateDto, LodgeUpdateDto } from './dto/lodge.dto';
import { HeaderLodge } from './entities/header.entity';
import { Lodge } from './entities/lodge.entity';

@Injectable()
export class LodgeService {
	constructor(
		@InjectModel(Lodge)
		private lodgeModel: typeof Lodge,
		@InjectModel(HeaderLodge)
		private readonly headerModel: typeof HeaderLodge,
		@InjectConnection()
		private readonly sequelize: Sequelize,
		private readonly bookingService: BookingService,
		private readonly filesService: FilesService,
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

	async createHeader(dto: HeaderLodgeCreateDto, file?: Express.Multer.File) {
		const uploaded = await this.filesService.upload(file, 'header');

		const headerData = await this.headerModel.create({
			...dto,
			image: uploaded,
		});

		return headerData;
	}

	async getHeader() {
		const getHeader = await this.headerModel.findOne();
		if (!getHeader) {
			throw new NotFoundException('header info not found');
		}
		return getHeader;
	}

	async updateHeader(
		id: number,
		urlId: string,
		dto: HeaderLodgeUpdateDto,
		file?: Express.Multer.File,
	) {
		if (!file || !urlId) {
			throw new BadRequestException(
				'Для обновления заголовка необходимо предоставить и файл, и urlId',
			);
		}

		const header = await this.headerModel.findByPk(id);
		if (!header) {
			throw new NotFoundException('Lodges item not found');
		}

		const targetKey = this.filesService.extractKey(urlId);
		await this.filesService.delete(targetKey);

		const newImg = await this.filesService.upload(file, 'header');

		await header.update({
			...dto,
			image: newImg,
		});

		return header;
	}

	async create(dto: LodgeCreateDto, files?: Express.Multer.File[]) {
		const imageUrls = await this.filesService.uploadMany(files, 'lodge');

		const londgNumber = await this.lodgeModel.findOne({
			where: { roomNumber: dto.roomNumber },
		});

		if (londgNumber) {
			throw new BadRequestException(
				`Этот номер уже существует ${dto.roomNumber}`,
			);
		}

		const lodge = await this.lodgeModel.create({
			...dto,
			images: imageUrls,
		});

		return lodge;
	}

	async findAll(page: number, limit: number) {
		const safePage = Number(page) > 0 ? Number(page) : 1;
		const safeLimit = Number(limit) > 0 ? Number(limit) : 10;

		const total = await this.lodgeModel.count();

		const { maxPageCount, offset } = calculatePagination(
			safePage,
			safeLimit,
			total,
		);

		const lodges = await this.lodgeModel.findAll({
			order: [['created_at', 'DESC']],
			limit: safeLimit,
			offset,
		});

		if (!lodges.length) {
			throw new NotFoundException('Lodges not found');
		}

		return {
			data: lodges,
			meta: {
				total,
				page: safePage,
				limit: safeLimit,
				maxPageCount,
			},
		};
	}

	async findById(id: number) {
		const lodge = await this.lodgeModel.findByPk(id);
		if (!lodge) {
			throw new NotFoundException(`Lodge with id ${id} not found`);
		}
		return lodge;
	}

	async update(
		id: number,
		dto: LodgeUpdateDto,
		urlId: string,
		file?: Express.Multer.File,
	) {
		const lodge = await this.lodgeModel.findByPk(id);

		if (!lodge) {
			throw new NotFoundException('lodge not found');
		}

		let images: string[] = Array.isArray(lodge.images) ? [...lodge.images] : [];

		if (file) {
			if (urlId) {
				const targetKey = this.filesService.extractKey(urlId);

				await this.filesService.delete(targetKey);

				images = images.filter(img => {
					const imgKey = this.filesService.extractKey(img);
					return imgKey !== targetKey;
				});
			}
			const newImg = await this.filesService.upload(file, 'lodge');
			images.push(newImg);
		}
		await lodge.update({
			...dto,
			images,
		});

		return lodge;
	}

	async lodgeBookingWalkIn(dto: CreateBookingWalkInLodgeDto) {
		const transaction = await this.sequelize.transaction();
		try {
			const lodge = await this.findById(dto.lodgeId);
			const total = this.calculateTotalAmount(
				lodge.price,
				dto.checkIn,
				dto.checkOut,
			);
			const booking = await this.bookingService.bookingWalkIn(
				{
					lodgeId: lodge.id,
					totalPrice: total,
					guestName: dto.guestName,
					guestPhone: dto.guestPhone.trim(),
					guestEmail: dto.guestEmail.trim(),
					roomNumber: lodge.roomNumber,
					checkIn: dayjs(dto.checkIn).startOf('day').utc().toDate(),
					checkOut: dayjs(dto.checkOut).startOf('day').utc().toDate(),
					source: 'walk-in',
				},
				transaction,
			);

			await transaction.commit();

			return booking;
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	}

	async delete(id: number) {
		const lodge = await this.lodgeModel.findOne({ where: { id } });

		const images: string[] = Array.isArray(lodge.images)
			? [...lodge.images]
			: [];

		if (images.length > 0) {
			await Promise.all(
				images.map(async img => {
					try {
						const key = this.filesService.extractKey(img);
						await this.filesService.delete(key);
					} catch (err) {
						console.error(`Ошибка при удалении фото ${img}:`, err);
					}
				}),
			);
		}

		await lodge.destroy();
		return { message: 'lodge successfully deleted' };
	}
}
