import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
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

import { Auth } from '@/auth/decorators/auth.decorators';
import { CurrentAdmin } from '@/user/decorators/user.decorator';

import {
	HeaderPoolSpaCreateDto,
	HeaderPoolSpaUpdateDto,
} from './dto/header.dto';
import {
	PoolSpaCreateDto,
	PoolSpaUpdateDto,
	updateSliderDto,
	uploadSliderImagesDto,
} from './dto/pool_spa.createDto';
import { PoolAndSpaAreaService } from './pool-and-spa-area.service';

@Controller('pool-spa')
export class PoolAndSpaAreaController {
	constructor(private readonly poolAndSpaAreaService: PoolAndSpaAreaService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create/header')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async createHeader(
		@CurrentAdmin('role') role: string,
		@Body() dto: HeaderPoolSpaCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.poolAndSpaAreaService.createHeader(dto, file);
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
		@Query('urlId') urlId: string,
		@CurrentAdmin('id') userId: number,
		@Body() dto: HeaderPoolSpaUpdateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.poolAndSpaAreaService.updateHeader(id, urlId, dto, file);
	}

	@Get('header/info')
	@HttpCode(HttpStatus.OK)
	async getHeader() {
		return await this.poolAndSpaAreaService.getHeader();
	}

	@Get('sliders')
	@HttpCode(HttpStatus.OK)
	async getSliderImages() {
		return await this.poolAndSpaAreaService.getSlider();
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	async create(
		@CurrentAdmin('role') role: string,
		@Body() dto: PoolSpaCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.poolAndSpaAreaService.create(dto, file);
	}

	@Get('all')
	async findAll(@Query() limit: string) {
		return await this.poolAndSpaAreaService.findAll();
	}

	@Get(':id')
	async findById(@Param('id') id: number) {
		return await this.poolAndSpaAreaService.findById(id);
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
		@Body() dto: PoolSpaUpdateDto,
		@Param('id') id: number,
		@Query('urlId') urlId: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.poolAndSpaAreaService.update(id, dto, urlId, file);
	}

	@ApiBearerAuth('Authorization')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FilesInterceptor('files', 10))
	@Post('admin/create/slider')
	async createSlider(
		@Body() dto: uploadSliderImagesDto,
		@UploadedFiles() files?: Express.Multer.File[],
	) {
		return await this.poolAndSpaAreaService.uploadSliderImages(files);
	}

	@ApiQuery({
		name: 'urlId',
		required: false,
		type: String,
	})
	@ApiBearerAuth('Authorization')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@Put('admin/update/slider/:id')
	async updateSlider(
		@Body() dto: updateSliderDto,
		@Param('id') id: number,
		@Query('urlId') urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.poolAndSpaAreaService.updateSlider(id, urlId, file);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Delete('admin/delete/:id')
	async delete(@Param('id') id: number) {
		return await this.poolAndSpaAreaService.delete(id);
	}
}
