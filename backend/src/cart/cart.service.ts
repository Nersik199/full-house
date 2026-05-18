import { Injectable } from '@nestjs/common';
import { TicketService } from '@/ticket/ticket.service';

@Injectable()
export class CartService {
	constructor(private readonly ticketService: TicketService) {}

	async getCartTickets(ticketIds: number[]) {
		return await this.ticketService.getAvailableTicketsByIds(ticketIds);
	}
}