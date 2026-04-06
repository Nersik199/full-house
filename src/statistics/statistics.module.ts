import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { OrderModule } from '@/order/order.module';
import { BookingModule } from '@/booking/booking.module';

@Module({
  imports: [OrderModule, BookingModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
