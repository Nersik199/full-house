import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class HeaderHomeCreateDto {
	@ApiProperty({
		example: 'Комфорт и уют для вашего идеального отдыха.',
		description: 'Основной заголовок раздела главная',
	})
	@IsString({ message: 'Title должен быть строкой' })
	@IsNotEmpty({ message: 'Title обязательно' })
	@Length(5, 200, { message: 'Title должен содержать от 5 до 200 символов' })
	title: string;

	@ApiProperty({
		example: 'Что мы предлагаем',
		description:
			'Дополнительный подзаголовок для header (от 6 до 1500 символов)',
	})
	@IsString({ message: 'SubTitle должен быть строкой' })
	@IsNotEmpty({ message: 'SubTitle обязательно' })
	@Length(6, 1500, {
		message: 'Sub title должен содержать от 6 до 1500 символов',
	})
	subTitle: string;

	@ApiProperty({
		example:
			'Мы предлагаем комфортный отдых, качественный сервис и лучшие условия для вашего идеального отпуска.',
		description:
			'Подробное описание номера, отображаемое в header (от 6 до 1500 символов)',
	})
	@IsString({ message: 'Description должен быть строкой' })
	@IsNotEmpty({ message: 'Description обязательно' })
	@Length(6, 1500, {
		message: 'Description должен содержать от 6 до 1500 символов',
	})
	description: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение для шапки раздела home (опционально)',
	})
	file?: any;
}

export class HeaderHomeUpdateDto extends PartialType(HeaderHomeCreateDto) {}
