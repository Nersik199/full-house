import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import {
	HeaderCompanyCreateDto,
	HeaderCompanyType,
	HeaderCompanyUpdateDto,
} from '@/company_profile/dto/header.dto';
import { CompanyProfileHeader } from '@/company_profile/entities/company.profile.header.entity';
import { FilesService } from '@/files/files.service';
import { UpdateHeaderInterfaces } from '@/shared/interfaces/updateHeaderInterfaces';

import {
	CompanyProfileCreateDto,
	CompanyProfileUpdateDto,
} from './dto/company_profile.dto';
import { CompanyProfile } from './entities/company.profile.entity';

@Injectable()
export class CompanyProfileService {
	constructor(
		@InjectModel(CompanyProfile)
		private readonly companyProfile: typeof CompanyProfile,
		@InjectModel(CompanyProfileHeader)
		private readonly headerModel: typeof CompanyProfile,
		private readonly filesService: FilesService,
	) {}
	async createHeader(dto: HeaderCompanyCreateDto, file?: Express.Multer.File) {
		const image = file ? await this.filesService.upload(file, 'header') : null;

		if (!image) {
			throw new NotFoundException('image not found');
		}

		return this.headerModel.create({
			...dto,
			image,
		});
	}

	async getHeader(type?: HeaderCompanyType) {
		const where = type ? { type } : {};

		return await this.headerModel.findAll({
			where,
			order: [['createdAt', 'DESC']],
		});
	}

	async updateHeader(
		id: number,
		dto: HeaderCompanyUpdateDto,
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

	async create(dto: CompanyProfileCreateDto, file?: Express.Multer.File) {
		const uploaded = file
			? await this.filesService.upload(file, 'company_profile')
			: undefined;

		return await this.companyProfile.create({
			...dto,
			image: uploaded,
		});
	}

	async get() {
		const data = await this.companyProfile.findAll();
		if (!data) throw new NotFoundException('compony info not found');
		return data;
	}

	async update(
		id: number,
		urlId: string,
		dto: CompanyProfileUpdateDto,
		file?: Express.Multer.File,
	) {
		let newImg: string;
		if (urlId && file) {
			await this.filesService.delete(urlId);
			newImg = await this.filesService.upload(file, 'company_profile');
		}
		const [updatedCount, [updatedData]] = await this.companyProfile.update(
			{ ...dto, image: newImg },
			{
				where: { id },
				returning: true,
			},
		);

		if (updatedCount === 0)
			throw new NotFoundException('company profile not found');

		return updatedData;
	}

	async delete(id: number) {
		const companyProfile = await this.companyProfile.findByPk(id);

		if (!companyProfile) {
			throw new NotFoundException('company profile not found');
		}

		if (companyProfile.image) {
			await this.filesService.delete(companyProfile.image);
		}

		await companyProfile.destroy();

		return {
			message: 'company profile successfully deleted',
		};
	}
}
