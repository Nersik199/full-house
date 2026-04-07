import { Body, Controller, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { RoomCreatedOrderDto } from './dto/roomCreatedOrder.dto';
import { LodgeCreatedOrderDto } from './dto/lodgeCreatedOrder.dto';
import { TicketCreatedOrderDto } from './dto/ticketCreatedOrder.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('pay/room')
  async roomCreatedOrder(@Body() dto: RoomCreatedOrderDto) {
    const order = await this.orderService.roomCreatedOrder({ ...dto });
    return order;
  }

  @Post('pay/lodge')
  async lodgeCreatedOrder(@Body() dto: LodgeCreatedOrderDto) {
    const order = await this.orderService.lodgeCreatedOrder({ ...dto });
    return order;
  }

  @Post('pay/ticket')
  async ticketCreate(@Body() dto: TicketCreatedOrderDto) {
    const order = await this.orderService.ticketCreatedOrder({ ...dto });
    return order;
  }
}
