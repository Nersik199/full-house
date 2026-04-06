import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('all')
  async getAllStatistic() {
    return await this.statisticsService.getAllStatistics();
  }

  @Get('bookings')
  async getStatisticBooking() {
    return await this.statisticsService.getStatisticBooking();
  }
}
