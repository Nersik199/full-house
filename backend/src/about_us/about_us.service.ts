import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { AboutUsHeader } from '@/about_us/entities/about_us.header.entity';
import { FilesService } from '@/files/files.service';

import { AboutUsCreateDto, AboutUsUpdateDto } from './dto/about_us.createDto';
import {
	HeaderAboutUsCreateDto,
	HeaderAboutUsUpdateDto,
} from './dto/header.dto';
import { AboutUs } from './entities/about_us.entity';

@Injectable()
export class AboutUsService {
	constructor(
		@InjectModel(AboutUs)
		private readonly aboutUsModel: typeof AboutUs,
		@InjectModel(AboutUsHeader)
		private readonly headerModel: typeof AboutUsHeader,
		private readonly filesService: FilesService,
	) {}

	async createHeader(dto: HeaderAboutUsCreateDto, file?: Express.Multer.File) {
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
		dto: HeaderAboutUsUpdateDto,
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

		const updateData: any = { ...dto };

		if (file && decodedUrlId) {
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

	async create(dto: AboutUsCreateDto, file?: Express.Multer.File) {
		const uploaded = await this.filesService.upload(file, 'about-us');

		const aboutAs = await this.aboutUsModel.create({
			...dto,
			image: uploaded,
		});

		return aboutAs;
	}

	async findAll() {
		const menus = await this.aboutUsModel.findAll({
			order: [['created_at', 'DESC']],
		});

		if (!menus || menus.length === 0) {
			throw new NotFoundException('No found about us');
		}

		return menus;
	}

	async findById(id: number) {
		const menu = await this.aboutUsModel.findByPk(id);
		if (!menu) {
			throw new NotFoundException(`about us with id ${id} not found`);
		}
		return menu;
	}

	async update(
		id: number,
		dto: AboutUsUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		const aboutUs = await this.aboutUsModel.findByPk(id);

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
		const aboutUs = await this.aboutUsModel.findOne({ where: { id } });
		await aboutUs.destroy();
		const parsedUrl = new URL(aboutUs.image);
		const pathOnly = parsedUrl.pathname;
		await this.filesService.delete(pathOnly);
		return { message: 'aboutUs successfully deleted' };
	}
}
