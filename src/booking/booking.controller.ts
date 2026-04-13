import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { Auth } from '@/auth/decorators/auth.decorators';

import { BookingService } from './booking.service';
import { GetAllBookings, GetBookingsByDaysDto } from './dto/booking.dto';

@Controller('bookings')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get('/by-days')
	@ApiOperation({ summary: 'Получить бронирования по дням для категории' })
	@ApiResponse({
		status: 200,
		description: 'Список бронирований с массивом дат',
	})
	async getBooking(@Query() dto: GetBookingsByDaysDto) {
		return await this.bookingService.getBookingsByDays(dto);
	}

	@ApiOperation({ summary: 'Получить бронирования' })
	@ApiBearerAuth('Authorization')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@Get('/admin')
	async allBookingsForAdmin(
		@Query('limit') limit: number,
		@Query('page') page: number,
		@Query() type: GetAllBookings,
	) {
		return await this.bookingService.allBookingsAdmin(limit, page, type);
	}

	@ApiBearerAuth('Authorization')
	@Auth()
	@HttpCode(HttpStatus.OK)
	@Get('/search')
	async search(@Query('query') query: string) {
		return await this.bookingService.searchBooking(query);
	}
}
