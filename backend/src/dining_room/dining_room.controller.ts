import {
	Body,
	Controller,
	Delete,
	Get,
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
import { DecodeUrlPipe } from '@/shared/pipes/decode-url.pipe';
import { CurrentAdmin } from '@/user/decorators/user.decorator';

import { DiningRoomService } from './dining_room.service';
import {
	DiningRoomCreateDto,
	DiningRoomUpdateDto,
} from './dto/dining_room.createDto';
import {
	HeaderDiningRoomCreateDto,
	HeaderDiningRoomUpdateDto,
} from './dto/header.dto';

@Controller('dining-room')
export class DiningRoomController {
	constructor(private readonly diningRoomService: DiningRoomService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create/header')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	async createHeader(
		@CurrentAdmin('role') role: string,
		@Body() dto: HeaderDiningRoomCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.diningRoomService.createHeader(dto, file);
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
	async updateHeader(
		@Param('id') id: number,
		@CurrentAdmin('id') userId: number,
		@Body() dto: HeaderDiningRoomUpdateDto,
		@Query('urlId', DecodeUrlPipe) urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.diningRoomService.updateHeader(id, dto, urlId, file);
	}

	@Get('header/info')
	async getHeader() {
		return await this.diningRoomService.getHeader();
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	async create(
		@CurrentAdmin('role') role: string,
		@Body() dto: DiningRoomCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.diningRoomService.create(dto, file);
	}

	@Get('all')
	async findAll(@Query() limit: string) {
		return await this.diningRoomService.findAll();
	}

	@Get(':id')
	async findById(@Param('id') id: number) {
		return await this.diningRoomService.findById(id);
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
	async update(
		@Body() dto: DiningRoomUpdateDto,
		@Param('id') id: number,
		@Query('urlId', DecodeUrlPipe) urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.diningRoomService.update(id, dto, urlId, file);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Delete('admin/delete/:id')
	async delete(@Param('id') id: number) {
		return await this.diningRoomService.delete(id);
	}
}
