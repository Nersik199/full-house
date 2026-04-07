import {
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { CreateTicketDto } from './dto/CreateTicketDto';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAdmin } from '@/user/decorators/user.decorator';
import { HeaderTicketCreateDto } from './dto/header.dto';
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
    @Query('urlId') urlId: string,
    @CurrentAdmin('id') userId: number,
    @Body() dto: HeaderTicketCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.ticketService.updateHeader(id, urlId, dto, file);
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

  @Get('/all')
  async getAllTickets(@Query('date') date?: string) {
    return await this.ticketService.getAllTickets(date);
  }
}
