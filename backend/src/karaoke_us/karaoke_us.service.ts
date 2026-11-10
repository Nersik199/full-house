import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FilesService } from '@/files/files.service';
import { KaraokeUsHeader } from '@/karaoke_us/entities/karaoke_us.header.entity';
import { UpdateHeaderInterfaces } from '@/shared/interfaces/updateHeaderInterfaces';

import {
	HeaderKaraokeUsCreateDto,
	HeaderKaraokeUsUpdateDto,
} from './dto/header.dto';
import {
	KaraokeUsCreateDto,
	KaraokeUsUpdateDto,
} from './dto/karaoke_us.createDto';
import { KaraokeUs } from './entities/karaoke_us.entity';

@Injectable()
export class KaraokeUsService {
	constructor(
		@InjectModel(KaraokeUs)
		private readonly karaokeUsModel: typeof KaraokeUs,
		@InjectModel(KaraokeUsHeader)
		private readonly headerModel: typeof KaraokeUsHeader,
		private readonly filesService: FilesService,
	) {}

	async createHeader(
		dto: HeaderKaraokeUsCreateDto,
		file?: Express.Multer.File,
	) {
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
		dto: HeaderKaraokeUsUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const header = await this.headerModel.findByPk(id);
		if (!header) {
			throw new NotFoundException('About us item not found');
		}
		const decodedUrlId = urlId ? decodeURIComponent(urlId) : undefined;

		const updateData: UpdateHeaderInterfaces = { ...dto };

		if (file && decodedUrlId) {
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

	async create(dto: KaraokeUsCreateDto, file?: Express.Multer.File) {
		const uploaded = await this.filesService.upload(file, 'about-us');

		return await this.karaokeUsModel.create({
			...dto,
			image: uploaded,
		});
	}

	async findAll() {
		const menus = await this.karaokeUsModel.findAll({
			order: [['created_at', 'DESC']],
		});

		if (!menus || menus.length === 0) {
			throw new NotFoundException('No found about us');
		}

		return menus;
	}

	async findById(id: number) {
		const menu = await this.karaokeUsModel.findByPk(id);
		if (!menu) {
			throw new NotFoundException(`about us with id ${id} not found`);
		}
		return menu;
	}

	async update(
		id: number,
		dto: KaraokeUsUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		const aboutUs = await this.karaokeUsModel.findByPk(id);

		if (!aboutUs) {
			throw new NotFoundException('About us not found');
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

		await aboutUs.update(updateData);

		return aboutUs;
	}

	async delete(id: number) {
		const aboutUs = await this.karaokeUsModel.findOne({ where: { id } });
		await aboutUs.destroy();
		const parsedUrl = new URL(aboutUs.image);
		const pathOnly = parsedUrl.pathname;
		await this.filesService.delete(pathOnly);
		return { message: 'aboutUs successfully deleted' };
	}
}
