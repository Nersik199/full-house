import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsBoolean,
	IsDateString,
	IsNumber,
	IsOptional,
	Min,
} from 'class-validator';
import dayjs from 'dayjs';

export class SearchRoomDto {
	@ApiPropertyOptional({
		description: 'Дата заезда (ГГГГ-ММ-ДД)',
		example: dayjs().add(1, 'day').format('YYYY-MM-DD'),
		type: String,
	})
	@IsOptional()
	@IsDateString()
	@Transform(({ value }) => value || dayjs().format('YYYY-MM-DD'))
	start?: string;

	@ApiPropertyOptional({
		description: 'Дата выезда (ГГГГ-ММ-ДД)',
		example: dayjs().add(3, 'day').format('YYYY-MM-DD'),
		type: String,
	})
	@IsOptional()
	@IsDateString()
	@Transform(({ value }) => value || dayjs().add(1, 'day').format('YYYY-MM-DD'))
	end?: string;

	@ApiPropertyOptional({
		description: 'Количество взрослых',
		example: 2,
		default: 0,
		type: Number,
	})
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(0)
	adults?: number = 0;

	@ApiPropertyOptional({
		description: 'Количество детей',
		example: 0,
		default: 0,
		type: Number,
	})
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(0)
	children?: number = 0;

	@ApiPropertyOptional({
		description: 'Нужна ванная комната?',
		example: true,
		type: Boolean,
	})
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	@IsBoolean()
	bathRoom?: boolean;

	@ApiPropertyOptional({
		description: 'Нужна столовая?',
		example: false,
		type: Boolean,
	})
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	@IsBoolean()
	diningRoom?: boolean;

	@ApiPropertyOptional({
		description: 'Нужен балкон?',
		example: false,
		type: Boolean,
	})
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	@IsBoolean()
	balcony?: boolean;
}
