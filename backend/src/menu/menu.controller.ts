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
import { DecodeUrlPipe } from '@/shared/pipes/decode-url.pipe';
import { CurrentAdmin } from '@/user/decorators/user.decorator';

import { HeaderMenuCreateDto, HeaderMenuUpdateDto } from './dto/header.dto';
import { MenuCreateDto, MenuUpdateDto } from './dto/menu.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create/header')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async createHeader(
		@CurrentAdmin('role') role: string,
		@Body() dto: HeaderMenuCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.menuService.createHeader(dto, file);
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
		@Body() dto: HeaderMenuUpdateDto,
		@Query('urlId', DecodeUrlPipe) urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.menuService.updateHeader(id, dto, urlId, file);
	}

	@Get('header/info')
	@HttpCode(HttpStatus.OK)
	async getHeader() {
		return await this.menuService.getHeader();
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@HttpCode(HttpStatus.OK)
	async create(
		@CurrentAdmin('id') userId: number,
		@Body() dto: MenuCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.menuService.create(dto, file);
	}

	@Get('all')
	async findAll(@Query('page') page: number, @Query('limit') limit: number) {
		return await this.menuService.findAll(page, limit);
	}

	@ApiQuery({
		name: 'urlId',
		required: false,
		type: String,
	})
	@ApiBearerAuth('Authorization')
	@Auth()
	@Put('admin/update/:id')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async update(
		@Body() dto: MenuUpdateDto,
		@Param('id') id: number,
		@Query('urlId', DecodeUrlPipe) urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.menuService.update(id, dto, urlId, file);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Delete('admin/delete/:id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id') id: number) {
		return await this.menuService.delete(id);
	}
}
