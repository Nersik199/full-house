import { Module } from '@nestjs/common';

import { TicketModule } from '@/ticket/ticket.module';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
	imports: [TicketModule],
	controllers: [CartController],
	providers: [CartService],
})
export class CartModule {}
