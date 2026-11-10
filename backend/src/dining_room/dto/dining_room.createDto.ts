import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
} from 'class-validator';
import { Column, DataType } from 'sequelize-typescript';

export class DiningRoomCreateDto {
	@ApiProperty({
		example: 'Основной обеденный зал',
		description: 'Заголовок или название зала',
	})
	@IsString({ message: 'Заголовок должен быть строкой' })
	@IsNotEmpty({ message: 'Заголовок обязателен для заполнения' })
	@Length(5, 50, {
		message: 'Заголовок должен содержать от 5 до 50 символов',
	})
	title: string;

	@ApiProperty({
		example:
			'Просторный и уютный обеденный зал с комфортной атмосферой для гостей.',
		description: 'Описание обеденного зала',
	})
	@IsString({ message: 'Описание должно быть строкой' })
	@IsNotEmpty({ message: 'Описание обязательно для заполнения' })
	@Length(5, 500)
	description: string;

	@ApiPropertyOptional({
		example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		description: 'Ссылка на YouTube видео',
	})
	@IsOptional()
	@IsString({ message: 'youtubeUrl должен быть строкой' })
	@Matches(
		/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/,
		{
			message: 'youtubeUrl должен быть корректной ссылкой на YouTube',
		},
	)
	youtubeUrl?: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение обеденного зала (опционально)',
	})
	file?: any;
}

export class DiningRoomUpdateDto extends PartialType(DiningRoomCreateDto) {}
