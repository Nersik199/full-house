import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FilesService } from '@/files/files.service';
import { calculatePagination } from '@/shared/utils/calculate.pagination';

import { HeaderMenuCreateDto, HeaderMenuUpdateDto } from './dto/header.dto';
import { MenuCreateDto, MenuUpdateDto } from './dto/menu.dto';
import { HeaderMenu } from './entities/header.entity';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
	constructor(
		@InjectModel(Menu)
		private menuModel: typeof Menu,
		@InjectModel(HeaderMenu)
		private readonly headerModel: typeof HeaderMenu,
		private readonly filesService: FilesService,
	) {}

	async createHeader(dto: HeaderMenuCreateDto, file?: Express.Multer.File) {
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
		dto: HeaderMenuUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const header = await this.headerModel.findByPk(id);
		if (!header) {
			throw new NotFoundException('Menu item not found');
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

	async create(dto: MenuCreateDto, file?: Express.Multer.File) {
		const imageUrls = await this.filesService.upload(file, 'menu');

		const menu = await this.menuModel.create({
			...dto,
			image: imageUrls,
		});

		return menu;
	}

	async findAll(page: number, limit: number) {
		const total = await this.menuModel.count();

		const { maxPageCount, offset } = calculatePagination(
			Number(page),
			Number(limit),
			total,
		);

		const menus = await this.menuModel.findAll({
			order: [['created_at', 'DESC']],
			limit: Number(limit),
			offset,
		});

		if (!menus.length) {
			throw new NotFoundException('No menus found');
		}

		return {
			data: menus,
			meta: {
				total,
				page: Number(page),
				limit: Number(limit),
				maxPageCount,
			},
		};
	}

	async findById(id: number) {
		const menu = await this.menuModel.findByPk(id);
		if (!menu) {
			throw new NotFoundException(`menu with id ${id} not found`);
		}
		return menu;
	}

	async update(
		id: number,
		dto: MenuUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		const menu = await this.menuModel.findByPk(id);

		if (!menu) {
			throw new NotFoundException('Menu not found');
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

		await menu.update(updateData);

		return menu;
	}

	async delete(id: number) {
		const menu = await this.menuModel.findOne({ where: { id } });
		await menu.destroy();
		const parsedUrl = new URL(menu.image);
		const pathOnly = parsedUrl.pathname;
		await this.filesService.delete(pathOnly);
		return { message: 'Menu successfully deleted' };
	}
}
