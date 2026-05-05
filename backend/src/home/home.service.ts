import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FilesService } from '@/files/files.service';

import { HeaderHomeCreateDto, HeaderHomeUpdateDto } from './dto/header.dto';
import { HomeCreateDto, HomeUpdateDto } from './dto/home.dto';
import { HeaderHome } from './entities/header.entity';
import { Home } from './entities/home.entity';

@Injectable()
export class HomeService {
	constructor(
		@InjectModel(Home)
		private homeModel: typeof Home,
		@InjectModel(HeaderHome)
		private readonly headerModel: typeof HeaderHome,
		private readonly filesService: FilesService,
	) {}
	async createHeader(dto: HeaderHomeCreateDto, file?: Express.Multer.File) {
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
		dto: HeaderHomeUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const header = await this.headerModel.findByPk(id);
		if (!header) {
			throw new NotFoundException('Home item not found');
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

	async create(dto: HomeCreateDto, file?: Express.Multer.File) {
		try {
			const uploaded = await this.filesService.upload(file, 'home');

			const home = await this.homeModel.create({
				...dto,
				image: uploaded,
			});

			return home;
		} catch (error) {
			console.log(error);
		}
	}

	async findAll() {
		const home = await this.homeModel.findAll({
			order: [['created_at', 'DESC']],
		});

		if (!home || home.length === 0) {
			throw new NotFoundException('No home data found');
		}

		return home;
	}

	async findById(id: number) {
		const home = await this.homeModel.findByPk(id);
		if (!home) {
			throw new NotFoundException(`Home room with id ${id} not found`);
		}
		return home;
	}

	async update(
		id: number,
		dto: HomeUpdateDto,
		urlId: string,
		file?: Express.Multer.File,
	) {
		const home = await this.homeModel.findByPk(id);

		if (!home) {
			throw new NotFoundException('home  not found');
		}

		let images: string[] = Array.isArray(home.image) ? [...home.image] : [];

		if (file) {
			const targetKey = urlId.startsWith('/') ? urlId.slice(1) : urlId;

			await this.filesService.delete(targetKey);

			images = images.filter(img => {
				const imgKey = this.filesService.extractKey(img);
				return imgKey !== targetKey;
			});

			const newImg = await this.filesService.upload(file, 'home');
			images.push(newImg);
		}

		const [updatedCount, [updatedHome]] = await this.homeModel.update(
			{ ...dto, image: images[0] },
			{
				where: { id },
				returning: true,
			},
		);

		if (updatedCount === 0) throw new NotFoundException('home not found');

		return updatedHome;
	}
	async delete(id: number) {
		const home = await this.homeModel.findOne({ where: { id } });
		await home.destroy();
		const parsedUrl = new URL(home.image);
		const pathOnly = parsedUrl.pathname;
		await this.filesService.delete(pathOnly);
		return { message: 'Home successfully deleted' };
	}
}
