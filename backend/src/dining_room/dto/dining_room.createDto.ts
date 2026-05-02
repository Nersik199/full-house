import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class DiningRoomCreateDto {
	@ApiProperty({
		example: 'Основной обеденный зал',
		description: 'Заголовок или название зала',
	})
	@IsString({ message: 'Заголовок должен быть строкой' })
	@IsNotEmpty({ message: 'Заголовок обязателен для заполнения' })
	@Length(2, 255, {
		message: 'Заголовок должен содержать от 2 до 255 символов',
	})
	title: string;

	@ApiProperty({
		example:
			'Просторный и уютный обеденный зал с комфортной атмосферой для гостей.',
		description: 'Описание обеденного зала',
	})
	@IsString({ message: 'Описание должно быть строкой' })
	@IsNotEmpty({ message: 'Описание обязательно для заполнения' })
	@Length(6, 1500)
	description: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение обеденного зала (опционально)',
	})
	file?: any;
}

export class DiningRoomUpdateDto extends PartialType(DiningRoomCreateDto) {}
