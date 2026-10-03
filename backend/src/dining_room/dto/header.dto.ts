import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class HeaderDiningRoomCreateDto {
	@ApiProperty({
		example: 'Свадебный зал',
		description: 'Основной заголовок раздела свадебного зала',
		required: false,
	})
	@IsString({ message: 'Заголовок должен быть строкой' })
	@IsOptional()
	@Length(0, 100, { message: 'Title должен содержать от 5 до 100 символов' })
	title?: string;

	@ApiProperty({
		example: 'Идеальное место для вашего свадебного торжества',
		description: 'Короткий подзаголовок для свадебного зала',
	})
	@IsString({ message: 'Подзаголовок должен быть строкой' })
	@IsNotEmpty({ message: 'Подзаголовок обязателен' })
	@Length(5, 50, {
		message: 'Подзаголовок должен содержать от 5 до 50 символов',
	})
	subTitle: string;

	@ApiProperty({
		example:
			'Наш свадебный зал сочетает элегантный интерьер, просторное пространство и современное оснащение. Мы создаём атмосферу, в которой каждый момент вашего торжества станет по-настоящему незабываемым.',
		description: 'Подробное описание свадебного зала',
	})
	@IsString({ message: 'Описание должно быть строкой' })
	@IsNotEmpty({ message: 'Описание обязательно' })
	@Length(5, 300, {
		message: 'Описание должно содержать от 6 до 300 символов',
	})
	description: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение для шапки свадебного зала (опционально)',
	})
	file?: any;
}

export class HeaderDiningRoomUpdateDto extends PartialType(
	HeaderDiningRoomCreateDto,
) {}
