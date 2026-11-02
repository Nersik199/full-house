import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FilesService } from '@/files/files.service';
import {
	HeaderKaraokeCreateDto,
	HeaderKaraokeUpdateDto,
} from '@/karaoke/dto/header.dto';
import { HeaderKaraoke } from '@/karaoke/entities/header.entity';
import { UpdateHeaderInterfaces } from '@/shared/interfaces/updateHeaderInterfaces';
import { calculatePagination } from '@/shared/utils/calculate.pagination';
import { prepareUpdatedImages } from '@/shared/utils/helper';

import { KaraokeCreateDto, KaraokeUpdateDto } from './dto/karaoke.dto';
import { Karaoke } from './entities/karaoke.entity';

@Injectable()
export class KaraokeService {
	constructor(
		@InjectModel(Karaoke)
		private readonly karaokeModel: typeof Karaoke,
		private readonly filesService: FilesService,
		@InjectModel(HeaderKaraoke)
		private readonly headerModel: typeof HeaderKaraoke,
	) {}

	async createHeader(dto: HeaderKaraokeCreateDto, file?: Express.Multer.File) {
		const uploaded = await this.filesService.upload(file, 'header');

		return await this.headerModel.create({
			...dto,
			image: uploaded,
		});
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
		dto: HeaderKaraokeUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const header = await this.headerModel.findByPk(id);
		if (!header) {
			throw new NotFoundException('Lodge item not found');
		}

		const updateData: UpdateHeaderInterfaces = { ...dto };

		if (file && urlId) {
			try {
				const targetKey = this.filesService.extractKey(urlId);
				await this.filesService.delete(targetKey);

				updateData.image = await this.filesService.upload(file, 'header');
			} catch (error) {
				console.error('File update error:', error);
			}
		}

		await header.update(updateData);

		return header;
	}

	async create(dto: KaraokeCreateDto, files?: Express.Multer.File[]) {
		const imageUrls = await this.filesService.uploadMany(files, 'karaoke');

		return await this.karaokeModel.create({
			...dto,
			images: imageUrls,
		});
	}

	async findAll(page: number, limit: number) {
		const safePage = Number(page) > 0 ? Number(page) : 1;
		const safeLimit = Number(limit) > 0 ? Number(limit) : 10;

		const total = await this.karaokeModel.count();

		const { maxPageCount, offset } = calculatePagination(
			safePage,
			safeLimit,
			total,
		);

		const karaokes = await this.karaokeModel.findAll({
			order: [['created_at', 'DESC']],
			limit: safeLimit,
			offset,
		});

		if (!karaokes.length && total === 0) {
			throw new NotFoundException('No karaoke found');
		}

		return {
			data: karaokes,
			meta: {
				total,
				page: safePage,
				limit: safeLimit,
				maxPageCount,
			},
		};
	}

	async findById(id: number) {
		const karaoke = await this.karaokeModel.findByPk(id);

		if (!karaoke) {
			throw new NotFoundException(`Karaoke with id ${id} not found`);
		}

		return karaoke;
	}

	async update(
		id: number,
		dto: KaraokeUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const karaoke = await this.karaokeModel.findByPk(id);

		if (!karaoke) {
			throw new NotFoundException('Karaoke not found');
		}

		const dbImages: string[] = Array.isArray(karaoke.images)
			? [...karaoke.images]
			: [];

		const { updatedImages: filteredImages, removedImages } =
			prepareUpdatedImages(dbImages, dto.images);

		let updatedImages: string[] = filteredImages;

		if (removedImages.length > 0) {
			await Promise.all(
				removedImages.map(async img => {
					try {
						const key = this.filesService.extractKey(img);
						await this.filesService.delete(key);
					} catch (error) {
						console.error(`Error deleting image ${img}:`, error);
					}
				}),
			);
		}

		if (file) {
			if (urlId) {
				const targetKey = this.filesService.extractKey(urlId);

				await this.filesService.delete(targetKey);

				updatedImages = updatedImages.filter(img => {
					const imgKey = this.filesService.extractKey(img);
					return imgKey !== targetKey;
				});
			}

			const newImg = await this.filesService.upload(file, 'karaoke');

			updatedImages.push(newImg);
		}

		Object.assign(karaoke, {
			...dto,
			images: updatedImages,
		});

		await karaoke.save();

		return karaoke;
	}

	async delete(id: number) {
		const karaoke = await this.karaokeModel.findByPk(id);

		if (!karaoke) {
			throw new NotFoundException('Karaoke not found');
		}

		const images: string[] = Array.isArray(karaoke.images)
			? [...karaoke.images]
			: [];

		if (images.length > 0) {
			await Promise.all(
				images.map(async img => {
					try {
						const key = this.filesService.extractKey(img);
						await this.filesService.delete(key);
					} catch (error) {
						console.error(`Error deleting image ${img}:`, error);
					}
				}),
			);
		}

		await karaoke.destroy();

		return { message: 'karaoke successfully deleted' };
	}
}
