import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ticket } from './entities/ticket.entity';
import { InjectModel } from '@nestjs/sequelize';
import { TicketHeader } from './entities/header.dto';
import { CreateTicketDto } from './dto/CreateTicketDto';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
import { HeaderTicketCreateDto, HeaderTicketUpdateDto } from './dto/header.dto';
import { FilesService } from '@/files/files.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket) private readonly ticketModel: typeof Ticket,
    @InjectModel(TicketHeader)
    private readonly ticketHeader: typeof TicketHeader,
    private readonly filesService: FilesService,
  ) {}

  async findById(id: number) {
    const ticket = await this.ticketModel.findByPk(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async createHeader(dto: HeaderTicketCreateDto, file?: Express.Multer.File) {
    const uploaded = await this.filesService.upload(file, 'header');

    const headerData = await this.ticketHeader.create({
      ...dto,
      image: uploaded,
    });

    return headerData;
  }

  async getHeader() {
    const getHeader = await this.ticketHeader.findAll();
    if (!getHeader) {
      throw new NotFoundException('header info not found');
    }
    return getHeader;
  }

  async updateHeader(
    id: number,
    urlId: string,
    dto: HeaderTicketUpdateDto,
    file?: Express.Multer.File,
  ) {
    let newImg: string;
    if (urlId && file) {
      await this.filesService.delete(urlId);
      newImg = await this.filesService.upload(file, 'header');
    }
    const [updatedCount, [updatedHeader]] = await this.ticketHeader.update(
      { ...dto, image: newImg },
      {
        where: { id },
        returning: true,
      },
    );

    if (updatedCount === 0) throw new NotFoundException('Menu not found');

    return updatedHeader;
  }

  async setTicketsForDate(dto: CreateTicketDto) {
    if (!dayjs(dto.date).isValid()) {
      throw new BadRequestException('Invalid date format');
    }

    const targetDate = dayjs(dto.date).format('YYYY-MM-DD');
    const discountPercent = dto.discount || 0;

    if (discountPercent < 0 || discountPercent > 100) {
      throw new BadRequestException('Discount must be between 0 and 100');
    }

    const finalPrice =
      Math.round(dto.price * (1 - discountPercent / 100) * 100) / 100;

    const ticketData = {
      date: targetDate,
      price: dto.price,
      discount: discountPercent,
      finalPrice: finalPrice || dto.price,
      quantity: dto.quantity,
    };

    return await this.ticketModel.create(ticketData);
  }

  async getAllTickets(date?: string) {
    const baseDate = date ? dayjs(date) : dayjs();

    const start = baseDate.startOf('day').toDate();
    const end = baseDate.endOf('day').toDate();

    return await this.ticketModel.findAll({
      where: {
        date: {
          [Op.between]: [start, end],
        },
      },
      order: [['date', 'ASC']],
    });
  }

  async updateQuantity(id: number, quantitySold: number) {
    const ticket = await this.findById(id);

    if (!ticket) throw new NotFoundException('Ticket not found');

    if (ticket.quantity < quantitySold) {
      throw new BadRequestException('Not enough tickets available');
    }

    const newQuantity = ticket.quantity - quantitySold;

    const [updatedCount, [updatedTicket]] = await this.ticketModel.update(
      { quantity: newQuantity },
      {
        where: { id },
        returning: true,
      },
    );

    return updatedTicket;
  }

  async removeByDate(date: string) {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    return await this.ticketModel.destroy({
      where: { date: formattedDate },
    });
  }
}
