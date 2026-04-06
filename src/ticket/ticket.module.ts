import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ticket } from './entities/ticket.entity';
import { TicketHeader } from './entities/header.dto';

@Module({
  imports: [SequelizeModule.forFeature([Ticket, TicketHeader])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
