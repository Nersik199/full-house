import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiOperation,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorators';
import {
	HeaderLodgeCreateDto,
	HeaderLodgeUpdateDto,
} from '@/lodge/dto/header.dto';
import { DecodeUrlPipe } from '@/shared/pipes/decode-url.pipe';
import { CurrentAdmin } from '@/user/decorators/user.decorator';

import { KaraokeCreateDto, KaraokeUpdateDto } from './dto/karaoke.dto';
import { KaraokeService } from './karaoke.service';

@ApiTags('Karaoke')
@Controller('karaoke')
export class KaraokeController {
	constructor(private readonly karaokeService: KaraokeService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create/header')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async createHeader(
		@CurrentAdmin('role') role: string,
		@Body() dto: HeaderLodgeCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.karaokeService.createHeader(dto, file);
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
		@Body() dto: HeaderLodgeUpdateDto,
		@Query('urlId', DecodeUrlPipe) urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.karaokeService.updateHeader(id, dto, urlId, file);
	}

	@Get('header/info')
	@HttpCode(HttpStatus.OK)
	async getHeader() {
		return await this.karaokeService.getHeader();
	}

	@Post()
	@ApiOperation({ summary: 'Create karaoke' })
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FilesInterceptor('files'))
	create(
		@Body() dto: KaraokeCreateDto,
		@UploadedFiles() files?: Express.Multer.File[],
	) {
		return this.karaokeService.create(dto, files);
	}

	@Get()
	@ApiOperation({ summary: 'Get all karaoke' })
	findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
		return this.karaokeService.findAll(Number(page), Number(limit));
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get karaoke by ID' })
	findById(@Param('id', ParseIntPipe) id: number) {
		return this.karaokeService.findById(id);
	}

	@ApiQuery({
		name: 'urlId',
		required: false,
		type: String,
	})
	@Patch(':id')
	@ApiOperation({ summary: 'Update karaoke' })
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: KaraokeUpdateDto,
		@Query('urlId') urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return this.karaokeService.update(id, dto, urlId, file);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete karaoke' })
	delete(@Param('id', ParseIntPipe) id: number) {
		return this.karaokeService.delete(id);
	}
}
