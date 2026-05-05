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
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { CurrentAdmin } from 'src/user/decorators/user.decorator';

import { SearchRoomDto } from '@/room/dto/room.search.dto';

import { HeaderRoomCreateDto, HeaderRoomUpdateDto } from './dto/header.dto';
import { CreateBookingWalkInDto } from './dto/room.booking.walkIn.dto';
import { GetAllRoomsDto, RoomCreateDto, RoomUpdateDto } from './dto/room.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create/header')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async createHeader(
		@CurrentAdmin('role') role: string,
		@Body() dto: HeaderRoomCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.roomService.createHeader(dto, file);
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
		@Body() dto: HeaderRoomUpdateDto,
		@Query('urlId') urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.roomService.updateHeader(id, dto, urlId, file);
	}

	@Get('header/info')
	@HttpCode(HttpStatus.OK)
	async getHeader() {
		return await this.roomService.getHeader();
	}

	@Get('search')
	async search(@Query() query: SearchRoomDto) {
		return this.roomService.search(query);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FilesInterceptor('files', 10))
	@HttpCode(HttpStatus.OK)
	async create(
		@CurrentAdmin('role') role: string,
		@Body() dto: RoomCreateDto,
		@UploadedFiles() files?: Express.Multer.File[],
	) {
		return await this.roomService.create(dto, files);
	}

	@Get('all')
	@HttpCode(HttpStatus.OK)
	async findAll(
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query() dto?: GetAllRoomsDto,
	) {
		return await this.roomService.findAll(page, limit, dto);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findById(@Param('id') id: number) {
		return await this.roomService.findById(id);
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
		@Body() dto: RoomUpdateDto,
		@Param('id') id: number,
		@Query('urlId') urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.roomService.update(id, dto, urlId, file);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/walk-in')
	@HttpCode(HttpStatus.OK)
	async roomBookingWalkIn(@Body() dto: CreateBookingWalkInDto) {
		return await this.roomService.roomBookingWalkIn(dto);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Delete('admin/delete/:id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id') id: number) {
		return await this.roomService.delete(id);
	}
}
