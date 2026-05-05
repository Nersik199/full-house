import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FilesService } from '@/files/files.service';

import {
	HeaderPoolSpaCreateDto,
	HeaderPoolSpaUpdateDto,
} from './dto/header.dto';
import { PoolSpaCreateDto, PoolSpaUpdateDto } from './dto/pool_spa.createDto';
import { PoolAndSpaAreaHeader } from './entities/header.entity';
import { PoolSpa } from './entities/pool.and.spa.area.entity';
import { SliderImage } from './entities/slider.images.entity';

@Injectable()
export class PoolAndSpaAreaService {
	constructor(
		@InjectModel(PoolSpa)
		private poolSpaModel: typeof PoolSpa,
		@InjectModel(SliderImage)
		private sliderImageModel: typeof SliderImage,
		@InjectModel(PoolAndSpaAreaHeader)
		private readonly headerModel: typeof PoolAndSpaAreaHeader,
		private readonly filesService: FilesService,
	) {}

	async createHeader(dto: HeaderPoolSpaCreateDto, file?: Express.Multer.File) {
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
		dto: HeaderPoolSpaUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const header = await this.headerModel.findByPk(id);
		if (!header) {
			throw new NotFoundException('pool-spa item not found');
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

	async create(dto: PoolSpaCreateDto, file?: Express.Multer.File) {
		try {
			const uploaded = await this.filesService.upload(file, 'pool-spa');

			const poolSpa = await this.poolSpaModel.create({
				...dto,
				image: uploaded,
			});

			return poolSpa;
		} catch (error) {
			console.log(error);
		}
	}

	async findAll() {
		const poolSpa = await this.poolSpaModel.findAll({
			order: [['created_at', 'DESC']],
		});

		if (!poolSpa || poolSpa.length === 0) {
			throw new NotFoundException('No Pool Spa found');
		}

		return poolSpa;
	}

	async findById(id: number) {
		const poolSpa = await this.poolSpaModel.findByPk(id);
		if (!poolSpa) {
			throw new NotFoundException(`Pool Spa with id ${id} not found`);
		}
		return poolSpa;
	}

	async update(
		id: number,
		dto: PoolSpaUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		const poolSpa = await this.poolSpaModel.findByPk(id);

		if (!poolSpa) {
			throw new NotFoundException('Pool Spa not found');
		}

		let images: string[] = Array.isArray(poolSpa.image)
			? [...poolSpa.image]
			: [];

		if (file) {
			const targetKey = urlId.startsWith('/') ? urlId.slice(1) : urlId;

			await this.filesService.delete(targetKey);

			images = images.filter(img => {
				const imgKey = this.filesService.extractKey(img);
				return imgKey !== targetKey;
			});

			const newImg = await this.filesService.upload(file, 'pool-spa');
			images.push(newImg);
		}

		const [updatedCount, [updatedPoolSpa]] = await this.poolSpaModel.update(
			{ ...dto, image: images[0] },
			{
				where: { id },
				returning: true,
			},
		);

		if (updatedCount === 0) throw new NotFoundException('Pool-Spa not found');

		return updatedPoolSpa;
	}

	async delete(id: number) {
		const diningRoom = await this.poolSpaModel.findOne({ where: { id } });
		await diningRoom.destroy();
		const parsedUrl = new URL(diningRoom.image);
		const pathOnly = parsedUrl.pathname;
		await this.filesService.delete(pathOnly);
		return { message: 'Pool Spa successfully deleted' };
	}

	async uploadSliderImages(files: Express.Multer.File[]) {
		try {
			const images = await this.filesService.uploadMany(
				files,
				'pool-spa/slider',
			);
			const slider = await this.sliderImageModel.create({ images });
			return slider;
		} catch (error) {
			console.log(error);
		}
	}

	async getSlider() {
		const slider = await this.sliderImageModel.findAll();
		if (!slider) throw new NotFoundException('slider нету');
		return slider;
	}

	async updateSlider(id: number, urlId?: string, file?: Express.Multer.File) {
		const slider = await this.sliderImageModel.findByPk(id);

		if (!slider) {
			throw new NotFoundException('Slider images not found');
		}

		let images: string[] = Array.isArray(slider.images)
			? [...slider.images]
			: [];

		if (urlId) {
			const targetKey = this.filesService.extractKey(urlId);

			try {
				await this.filesService.delete(targetKey);

				images = images.filter(img => {
					const imgKey = this.filesService.extractKey(img);
					return imgKey !== targetKey;
				});
			} catch (error) {
				console.error('Ошибка при удалении старого файла:', error);
			}
		}

		if (file) {
			const newImg = await this.filesService.upload(file, 'pool-spa/slider');
			images.push(newImg);
		}

		await slider.update({ images });

		return slider;
	}
}
