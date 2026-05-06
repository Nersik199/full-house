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
import { Auth } from 'src/auth/decorators/auth.decorators';

import { DecodeUrlPipe } from '@/shared/pipes/decode-url.pipe';
import { CurrentAdmin } from '@/user/decorators/user.decorator';

import { CreateTicketDto } from './dto/CreateTicketDto';
import { HeaderTicketCreateDto } from './dto/header.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
	constructor(private readonly ticketService: TicketService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@Post('admin/create/header')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@HttpCode(HttpStatus.OK)
	async createHeader(
		@CurrentAdmin('role') role: string,
		@Body() dto: HeaderTicketCreateDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.ticketService.createHeader(dto, file);
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
		@Body() dto: HeaderTicketCreateDto,
		@Query('urlId', DecodeUrlPipe) urlId?: string,
		@UploadedFile() file?: Express.Multer.File,
	) {
		return await this.ticketService.updateHeader(id, dto, urlId, file);
	}

	@Get('header/info')
	@HttpCode(HttpStatus.OK)
	async getHeader() {
		return await this.ticketService.getHeader();
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@Post('/create')
	async createTicket(@Body() dto: CreateTicketDto) {
		return await this.ticketService.setTicketsForDate(dto);
	}

	@Get('/by-days')
	async getByDaysTickets(@Query('date') date?: string) {
		return await this.ticketService.getByDaysTickets(date);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@Get('admin/all')
	async getAllTickets(
		@Query('limit') limit?: number,
		@Query('page') page?: number,
	) {
		return await this.ticketService.getAllTickets(page, limit);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	async deleteTicket(@Param('id') id: string) {
		return await this.ticketService.ticketRemove(Number(id));
	}
}
