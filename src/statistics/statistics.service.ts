import { BookingService } from '@/booking/booking.service';
import { OrderService } from '@/order/order.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly orderService: OrderService,
    private readonly bookingService: BookingService,
  ) {}

  async getAllStatistics() {
    return this.orderService.getAllStatistic();
  }

  async getStatisticBooking() {}
}
