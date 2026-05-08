import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { HeaderAboutUsUpdateDto } from '@/about_us/dto/header.dto';
import { DiningRoomHeader } from '@/dining_room/entities/dining_room.header.entity';
import { FilesService } from '@/files/files.service';
import { UpdateHeaderInterfaces } from '@/shared/interfaces/updateHeaderInterfaces';

import {
	DiningRoomCreateDto,
	DiningRoomUpdateDto,
} from './dto/dining_room.createDto';
import { HeaderDiningRoomCreateDto } from './dto/header.dto';
import { DiningRoom } from './entities/dining_room.entity';

@Injectable()
export class DiningRoomService {
	constructor(
		@InjectModel(DiningRoom)
		private readonly diningRoomModel: typeof DiningRoom,
		@InjectModel(DiningRoomHeader)
		private readonly headerModel: typeof DiningRoomHeader,
		private readonly filesService: FilesService,
	) {}

	async createHeader(
		dto: HeaderDiningRoomCreateDto,
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
		dto: HeaderAboutUsUpdateDto,
		urlId?: string,
		file?: Express.Multer.File,
	) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const header = await this.headerModel.findByPk(id);
		if (!header) {
			throw new NotFoundException('Dining room item not found');
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

	async create(dto: DiningRoomCreateDto, file?: Express.Multer.File) {
		try {
			const uploaded = await this.filesService.upload(file, 'dining-room');

			return await this.diningRoomModel.create({
				...dto,
				image: uploaded,
			});
		} catch (error) {
			console.log(error);
		}
	}

	async findAll() {
		const diningRoom = await this.diningRoomModel.findAll({
			order: [['created_at', 'DESC']],
		});

		if (!diningRoom || diningRoom.length === 0) {
			throw new NotFoundException('No Dining room found');
		}

		return diningRoom;
	}

	async findById(id: number) {
		const diningRoom = await this.diningRoomModel.findByPk(id);
		if (!diningRoom) {
			throw new NotFoundException(`Dining room with id ${id} not found`);
		}
		return diningRoom;
	}

	async update(
		id: number,
		dto: DiningRoomUpdateDto,
		urlId: string,
		file?: Express.Multer.File,
	) {
		const diningRoom = await this.diningRoomModel.findByPk(id);

		if (!diningRoom) {
			throw new NotFoundException('Dining room not found');
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

		await diningRoom.update(updateData);

		return diningRoom;
	}

	async delete(id: number) {
		const diningRoom = await this.diningRoomModel.findOne({ where: { id } });
		await diningRoom.destroy();
		const parsedUrl = new URL(diningRoom.image);
		const pathOnly = parsedUrl.pathname;
		await this.filesService.delete(pathOnly);
		return { message: 'Dining room successfully deleted' };
	}
}
