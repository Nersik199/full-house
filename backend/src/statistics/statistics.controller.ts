import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorators';

import { StatisticsService } from './statistics.service';
import { DateFilterDto } from './dto/statistics.dto';

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@Get('')
	async getAllStatistic(
		@Query() query?: DateFilterDto,
	) {
		const {startDate , endDate} = query || {}
		return await Promise.all([
			this.statisticsService.getStatisticHotels(startDate, endDate),
			this.statisticsService.getStatisticLodge(),
			this.statisticsService.getStatisticSpa(),
		]);
	}
}
