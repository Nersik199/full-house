import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportCreateDto, SupportUpdateDto } from './dto/support.dto';
import { Support } from './entities/support.entity';

@Injectable()
export class SupportService {
	constructor(
		@InjectModel(Support)
		private supportModel: typeof Support,
	) {}

	async create(dto: SupportCreateDto) {
		const existing = await this.supportModel.findOne({
			where: { type: dto.type },
		});

		if (existing) {
			throw new BadRequestException(
				`Support with type ${dto.type} already exists`,
			);
		}

		return await this.supportModel.create({
			...dto,
		});
	}

	async findAll() {
		const supports = await this.supportModel.findAll({
			order: [['created_at', 'DESC']],
		});

		if (!supports.length) {
			throw new NotFoundException('No supports found');
		}

		return supports;
	}

	async findByType(type: string) {
		const support = await this.supportModel.findOne({
			where: { type },
		});

		if (!support) {
			throw new NotFoundException(`Support with type ${type} not found`);
		}

		return support;
	}

	async findById(id: number) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const support = await this.supportModel.findByPk(id);

		if (!support) {
			throw new NotFoundException(`Support with id ${id} not found`);
		}

		return support;
	}

	async update(id: number, dto: SupportUpdateDto) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const support = await this.supportModel.findByPk(id);

		if (!support) {
			throw new NotFoundException('Support not found');
		}

		if (dto.type && dto.type !== support.type) {
			const existing = await this.supportModel.findOne({
				where: { type: dto.type },
			});

			if (existing) {
				throw new BadRequestException(
					`Support with type ${dto.type} already exists`,
				);
			}
		}

		await support.update(dto);

		return support;
	}

	async delete(id: number) {
		if (isNaN(id)) {
			throw new BadRequestException('Invalid ID');
		}

		const support = await this.supportModel.findByPk(id);

		if (!support) {
			throw new NotFoundException('Support not found');
		}

		await support.destroy();

		return {
			message: 'Support successfully deleted',
		};
	}
}
