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
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
}
