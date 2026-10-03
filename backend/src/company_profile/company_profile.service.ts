import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FilesService } from '@/files/files.service';

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
		private readonly filesService: FilesService,
	) {}

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
