import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TicketModule } from '@/ticket/ticket.module';

@Module({
	imports: [TicketModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
