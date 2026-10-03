import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class HeaderAboutUsCreateDto {
	@ApiProperty({
		example: 'Наше меню',
		description: 'Основной заголовок раздела меню',
		required: false,
	})
	@IsString({ message: 'Title должен быть строкой' })
	@IsOptional()
	@Length(0, 100, { message: 'Title должен содержать от 5 до 100 символов' })
	title?: string;

	@ApiProperty({
		example: 'Блюда, приготовленные с любовью и из свежих ингредиентов',
		description: 'Короткий подзаголовок для раздела меню',
	})
	@IsString({ message: 'SubTitle должен быть строкой' })
	@IsNotEmpty({ message: 'SubTitle обязательно' })
	@Length(5, 50, {
		message: 'Sub title должен содержать от 5 до 50 символов',
	})
	subTitle: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение для шапки раздела меню (опционально)',
	})
	file?: any;
}

export class HeaderAboutUsUpdateDto extends PartialType(
	HeaderAboutUsCreateDto,
) {}
