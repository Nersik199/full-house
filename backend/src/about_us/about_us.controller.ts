import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorators';
import { CurrentAdmin } from '@/user/decorators/user.decorator';

import { AboutUsService } from './about_us.service';
import { AboutUsCreateDto, AboutUsUpdateDto } from './dto/about_us.createDto';
import {
	HeaderAboutUsCreateDto,
	HeaderAboutUsUpdateDto,
} from './dto/header.dto';

@Controller('about-us')
export class AboutUsController {
	constructor(private readonly aboutUsService: AboutUsService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create/header')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async createHeader(
		@CurrentAdmin('role') role: string,
		@Body() dto: HeaderAboutUsCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.aboutUsService.createHeader(dto, file);
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
	async updateHeader(
		@Param('id') id: number,
		@CurrentAdmin('id') userId: number,
		@Body() dto: HeaderAboutUsUpdateDto,
		@Query('urlId') urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.aboutUsService.updateHeader(id, dto, urlId, file);
	}

	@Get('header/info')
	@HttpCode(HttpStatus.OK)
	async getHeader() {
		return await this.aboutUsService.getHeader();
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async create(
		@CurrentAdmin('role') role: string,
		@Body() dto: AboutUsCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.aboutUsService.create(dto, file);
	}

	@Get('all')
	@HttpCode(HttpStatus.OK)
	async findAll(@Query() limit: string) {
		return await this.aboutUsService.findAll();
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findById(@Param('id') id: number) {
		return await this.aboutUsService.findById(id);
	}

	@ApiQuery({
		name: 'urlId',
		required: false,
		type: String,
	})
	@ApiBearerAuth('Authorization')
	@Auth()
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@Put('admin/update/:id')
	@HttpCode(HttpStatus.OK)
	async update(
		@Body() dto: AboutUsUpdateDto,
		@Param('id') id: number,
		@Query('urlId') urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.aboutUsService.update(id, dto, urlId, file);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Delete('admin/delete/:id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id') id: number) {
		return await this.aboutUsService.delete(id);
	}
}
