import { Injectable } from '@nestjs/common';
import { Ticket } from './entities/ticket.entity';
import { InjectModel } from '@nestjs/sequelize';
import { TicketHeader } from './entities/header.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket) private readonly ticketModel: typeof Ticket,
    @InjectModel(TicketHeader)
    private readonly ticketHeader: typeof TicketHeader,
  ) {}
}
