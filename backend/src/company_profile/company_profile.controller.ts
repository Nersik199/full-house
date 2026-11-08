import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorators';
import {
	HeaderCompanyCreateDto,
	HeaderCompanyType,
	HeaderCompanyUpdateDto,
} from '@/company_profile/dto/header.dto';
import { DecodeUrlPipe } from '@/shared/pipes/decode-url.pipe';
import { CurrentAdmin } from '@/user/decorators/user.decorator';

import { CompanyProfileService } from './company_profile.service';
import {
	CompanyProfileCreateDto,
	CompanyProfileUpdateDto,
} from './dto/company_profile.dto';

@Controller('company-profile')
export class CompanyProfileController {
	constructor(private readonly companyProfileService: CompanyProfileService) {}

	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				title: { type: 'string' },
				subTitle: { type: 'string' },
				type: {
					type: 'string',
					enum: Object.values(HeaderCompanyType),
				},
				file: {
					type: 'string',
					format: 'binary',
				},
			},
			required: ['subTitle'],
		},
	})
	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create/header')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async createHeaderCompany(
		@CurrentAdmin('role') role: string,
		@Body() dto: HeaderCompanyCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.companyProfileService.createHeader(dto, file);
	}

	@ApiQuery({
		name: 'urlId',
		required: false,
		type: String,
	})
	@ApiBearerAuth('Authorization')
	@Auth()
	@Put('admin/update/header/:id')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async updateHeaderCompany(
		@Param('id', ParseIntPipe) id: number,
		@CurrentAdmin('id') userId: number,
		@Body() dto: HeaderCompanyUpdateDto,
		@Query('urlId', DecodeUrlPipe) urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.companyProfileService.updateHeader(id, dto, urlId, file);
	}

	@Get('header/info')
	@HttpCode(HttpStatus.OK)
	async getHeaderCompany(@Query('type') type?: HeaderCompanyType) {
		return this.companyProfileService.getHeader(type);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async createHeader(
		@CurrentAdmin('role') role: string,
		@Body() dto: CompanyProfileCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.companyProfileService.create(dto, file);
	}

	@ApiQuery({
		name: 'urlId',
		required: false,
		type: String,
	})
	@ApiBearerAuth('Authorization')
	@Auth()
	@Put('admin/update/profile/:id')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async updateHeader(
		@Param('id') id: number,
		@Query('urlId') urlId: string,
		@CurrentAdmin('id') userId: number,
		@Body() dto: CompanyProfileUpdateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.companyProfileService.update(id, urlId, dto, file);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getHeader() {
		return await this.companyProfileService.get();
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Delete('admin/delete/:id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id') id: number) {
		return await this.companyProfileService.delete(id);
	}
}
