import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorators';

import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@ApiBearerAuth('Authorization')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@Get('')
	async getAllStatistic() {
		// @Query('startDate') startDate?: string,
		// @Query('endDate') endDate?: string,
		return await this.statisticsService.getAllStatistics();
	}
}
