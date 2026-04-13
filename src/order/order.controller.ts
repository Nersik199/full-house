import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { LodgeCreatedOrderDto } from './dto/lodgeCreatedOrder.dto';
import { RoomCreatedOrderDto } from './dto/roomCreatedOrder.dto';
import { TicketCreatedOrderDto } from './dto/ticketCreatedOrder.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post('pay/room')
	@HttpCode(HttpStatus.OK)
	async roomCreatedOrder(@Body() dto: RoomCreatedOrderDto) {
		const order = await this.orderService.roomCreatedOrder({ ...dto });
		return order;
	}

	@Post('pay/lodge')
	@HttpCode(HttpStatus.OK)
	async lodgeCreatedOrder(@Body() dto: LodgeCreatedOrderDto) {
		const order = await this.orderService.lodgeCreatedOrder({ ...dto });
		return order;
	}

	@Post('pay/ticket')
	@HttpCode(HttpStatus.OK)
	async ticketCreate(@Body() dto: TicketCreatedOrderDto) {
		const order = await this.orderService.ticketCreatedOrder({ ...dto });
		return order;
	}
}
