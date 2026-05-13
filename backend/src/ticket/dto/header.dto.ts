import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class HeaderTicketCreateDto {
	@ApiProperty({
		example: 'Билеты на выставку',
		description: 'Основной заголовок раздела билетов',
	})
	@IsString({ message: 'Title должен быть строкой' })
	@IsNotEmpty({ message: 'Title обязательно' })
	@Length(5, 100, { message: 'Title должен содержать от 5 до 100 символов' })
	title: string;

	@ApiProperty({
		example: 'Выбирайте подходящий тариф и бронируйте места заранее',
		description: 'Короткий подзаголовок для раздела билетов',
	})
	@IsString({ message: 'SubTitle должен быть строкой' })
	@IsNotEmpty({ message: 'SubTitle обязательно' })
	@Length(5, 50, {
		message: 'Sub title должен содержать от 5 до 50 символов',
	})
	subTitle: string;

	@ApiProperty({
		example:
			'В этом разделе вы можете приобрести билеты на будние и выходные дни. Доступны льготные тарифы, групповые посещения и VIP-пакеты.',
		description: 'Подробное описание раздела билетов',
	})
	@IsString({ message: 'Description должен быть строкой' })
	@IsNotEmpty({ message: 'Description обязательно' })
	@Length(5, 300, {
		message: 'Description должен содержать от 5 до 300 символов',
	})
	description: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Фоновое изображение для баннера билетов (опционально)',
	})
	file?: any;
}

export class HeaderTicketUpdateDto extends PartialType(HeaderTicketCreateDto) {}
