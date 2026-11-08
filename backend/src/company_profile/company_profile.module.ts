import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CompanyProfileHeader } from '@/company_profile/entities/company.profile.header.entity';
import { FilesModule } from '@/files/files.module';

import { CompanyProfileController } from './company_profile.controller';
import { CompanyProfileService } from './company_profile.service';
import { CompanyProfile } from './entities/company.profile.entity';

@Module({
	imports: [
		SequelizeModule.forFeature([CompanyProfile, CompanyProfileHeader]),
		FilesModule,
	],
	controllers: [CompanyProfileController],
	providers: [CompanyProfileService],
})
export class CompanyProfileModule {}
