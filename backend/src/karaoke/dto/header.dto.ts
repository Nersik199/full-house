import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class HeaderKaraokeCreateDto {
	@ApiProperty({
		example: 'Karaoke',
		description: 'Основной заголовок блока header',
		required: false,
	})
	@IsString({ message: 'Title должен быть строкой' })
	@IsOptional()
	@Length(0, 100, {
		message: 'Title должен содержать от 0 до 100 символов',
	})
	title?: string;

	@ApiProperty({
		example: 'Незабываемые вечера в караоке',
		description: 'Дополнительный подзаголовок для header',
	})
	@IsString({ message: 'SubTitle должен быть строкой' })
	@IsNotEmpty({ message: 'SubTitle обязательно' })
	@Length(5, 50, {
		message: 'Sub title должен содержать от 5 до 50 символов',
	})
	subTitle: string;

	@ApiProperty({
		example: 'Пойте любимые песни в комфортной атмосфере.',
		description: 'Подробное описание караоке для гостей',
		required: false,
	})
	@IsString({ message: 'Description должен быть строкой' })
	@IsOptional()
	@Length(5, 300, {
		message: 'Description должен содержать от 5 до 300 символов',
	})
	description?: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение для header блока (один файл)',
	})
	file?: any;
}

export class HeaderKaraokeUpdateDto extends PartialType(
	HeaderKaraokeCreateDto,
) {}
