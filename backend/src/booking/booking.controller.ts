import { Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
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
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query() dto: GetAllBookings,
	) {
		return await this.bookingService.allBookingsAdmin(limit, page, dto);
	}

	@Patch('/:id')
	@Auth()
	@ApiBearerAuth('Authorization')
	@ApiOperation({ summary: 'Отменить бронирование' })
	@ApiParam({ name: 'id', type: Number, description: 'ID бронирования' })
	async cancelBooking(@Param('id', ParseIntPipe) id: number) {
		return this.bookingService.earlyCheckOut(id);
	}
}
