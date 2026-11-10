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
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorators';
import { DecodeUrlPipe } from '@/shared/pipes/decode-url.pipe';
import { CurrentAdmin } from '@/user/decorators/user.decorator';

import {
	HeaderKaraokeUsCreateDto,
	HeaderKaraokeUsUpdateDto,
} from './dto/header.dto';
import {
	KaraokeUsCreateDto,
	KaraokeUsUpdateDto,
} from './dto/karaoke_us.createDto';
import { KaraokeUsService } from './karaoke_us.service';

@Controller('karaoke')
export class KaraokeUsController {
	constructor(private readonly karaokeUsService: KaraokeUsService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create/header')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async createHeader(
		@CurrentAdmin('role') role: string,
		@Body() dto: HeaderKaraokeUsCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.karaokeUsService.createHeader(dto, file);
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
		@Param('id', ParseIntPipe) id: number,
		@CurrentAdmin('id') userId: number,
		@Body() dto: HeaderKaraokeUsUpdateDto,
		@Query('urlId', DecodeUrlPipe) urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.karaokeUsService.updateHeader(id, dto, urlId, file);
	}

	@Get('header/info')
	@HttpCode(HttpStatus.OK)
	async getHeader() {
		return await this.karaokeUsService.getHeader();
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async create(
		@CurrentAdmin('role') role: string,
		@Body() dto: KaraokeUsCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.karaokeUsService.create(dto, file);
	}

	@Get('all')
	@HttpCode(HttpStatus.OK)
	async findAll(@Query() limit: string) {
		return await this.karaokeUsService.findAll();
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findById(@Param('id') id: number) {
		return await this.karaokeUsService.findById(id);
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
		@Body() dto: KaraokeUsUpdateDto,
		@Param('id') id: number,
		@Query('urlId', DecodeUrlPipe) urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.karaokeUsService.update(id, dto, urlId, file);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Delete('admin/delete/:id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id') id: number) {
		return await this.karaokeUsService.delete(id);
	}
}
