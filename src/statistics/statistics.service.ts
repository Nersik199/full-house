import { Injectable } from '@nestjs/common';

import { BookingService } from '@/booking/booking.service';
import { OrderService } from '@/order/order.service';

@Injectable()
export class StatisticsService {
	constructor(
		private readonly orderService: OrderService,
		private readonly bookingService: BookingService,
	) {}

	async getAllStatistics() {}

	async getStatisticBooking() {}
}
