import { ApiProperty, ApiQuery, PartialType } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';

export class HomeCreateDto {
	@ApiProperty({
		example:
			'Мы предлагаем комфортный отдых, качественный сервис и лучшие условия для вашего идеального отпуска.',
		description: 'Название главная странице',
	})
	@IsString()
	@IsNotEmpty()
	@Length(5, 50)
	title: string;

	@ApiProperty({
		example:
			'Добро пожаловать в наше уютное пространство, где каждая деталь продумана для вашего комфорта и незабываемого отдыха. Мы предлагаем широкий выбор услуг...',
		description: 'Подробное описание о нас',
	})
	@IsString()
	@IsNotEmpty()
	@Length(5, 700)
	description: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Можно загрузить одно изображение для блока о нас',
	})
	file?: any;
}

export class HomeUpdateDto extends PartialType(HomeCreateDto) {}
