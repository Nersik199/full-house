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
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorators';

import { SupportCreateDto, SupportUpdateDto } from './dto/support.dto';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
	constructor(private readonly supportService: SupportService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create')
	@HttpCode(HttpStatus.OK)
	async create(@Body() dto: SupportCreateDto) {
		return await this.supportService.create(dto);
	}

	@Get('all')
	@HttpCode(HttpStatus.OK)
	async findAll() {
		return await this.supportService.findAll();
	}

	@ApiQuery({
		name: 'type',
		required: true,
		enum: ['terms', 'privacy'],
	})
	@Get('info')
	@HttpCode(HttpStatus.OK)
	async findByType(@Query('type') type: string) {
		return await this.supportService.findByType(type);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findById(@Param('id') id: number) {
		return await this.supportService.findById(id);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Put('admin/update/:id')
	@HttpCode(HttpStatus.OK)
	async update(@Param('id') id: number, @Body() dto: SupportUpdateDto) {
		return await this.supportService.update(id, dto);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Delete('admin/delete/:id')
	@HttpCode(HttpStatus.OK)
	async delete(@Param('id') id: number) {
		return await this.supportService.delete(id);
	}
}
