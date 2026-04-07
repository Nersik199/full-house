import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ticket } from './entities/ticket.entity';
import { TicketHeader } from './entities/header.dto';
import { FilesModule } from '@/files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([Ticket, TicketHeader]), FilesModule],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
