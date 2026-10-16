import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Matches,
	Max,
	Min,
} from 'class-validator';

export class CreateTicketDto {
	@ApiProperty({
		example: '2026-04-07',
		description: 'Дата начала действия билета в формате YYYY-MM-DD',
	})
	@IsNotEmpty({ message: 'Дата начала обязательна' })
	@IsString({ message: 'Дата начала должна быть строкой' })
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'Дата начала должна соответствовать формату YYYY-MM-DD',
	})
	startDate: string;

	@ApiProperty({
		example: '2026-04-15',
		description: 'Дата окончания действия билета в формате YYYY-MM-DD',
	})
	@IsNotEmpty({ message: 'Дата окончания обязательна' })
	@IsString({ message: 'Дата окончания должна быть строкой' })
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'Дата окончания должна соответствовать формату YYYY-MM-DD',
	})
	endDate: string;

	@ApiProperty({
		example: 50,
		description: 'Общее количество доступных билетов',
	})
	@IsNotEmpty({ message: 'Количество обязательно' })
	@IsNumber({}, { message: 'Количество должно быть числом' })
	@Min(0, { message: 'Количество не может быть отрицательным' })
	@Type(() => Number)
	quantity: number;

	@ApiProperty({
		example: 1500,
		description: 'Базовая цена билета без учета скидки',
	})
	@IsNotEmpty({ message: 'Цена обязательна' })
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@Min(0, { message: 'Цена не может быть отрицательной' })
	@Type(() => Number)
	price: number;

	@ApiProperty({
		example: 'Посещение СПА зоны',
	})
	@IsString()
	title: string;

	@ApiProperty({
		example: 'Отдых в СПА зоне с доступом к бассейну в будни',
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({
		example: 'Поздравления',
		required: false,
	})
	@IsOptional()
	@IsString()
	subTitle?: string;

	@ApiProperty({
		example: [
			'Доступ к бассейну',
			'Использование лежаков',
			'Доступ к ресто-бару',
			'Доступ к баням',
			'Церемонии парения',
		],
	})
	@IsArray()
	@IsString({ each: true })
	features: string[];

	@ApiProperty({
		example: 15,
		required: false,
		description: 'Размер скидки в процентах (от 0 до 100)',
		default: 0,
	})
	@IsOptional()
	@IsNumber({}, { message: 'Скидка должна быть числом' })
	@Min(0, { message: 'Скидка не может быть меньше 0%' })
	@Max(100, { message: 'Скидка не может превышать 100%' })
	@Type(() => Number)
	discount?: number;
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
