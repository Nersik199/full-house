import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PoolSpaCreateDto {
	@ApiProperty({
		example: 'Релакс и восстановление в нашей аква-зоне',
		description: 'Заголовок блока бассейна и спа',
	})
	@IsString({ message: 'Заголовок должен быть строкой' })
	@IsNotEmpty({ message: 'Заголовок обязателен для заполнения' })
	@Length(2, 255, {
		message: 'Заголовок должен содержать от 2 до 255 символов',
	})
	title: string;

	@ApiProperty({
		example:
			'Просторная зона бассейна и спа с тёплой водой, удобными шезлонгами и атмосферой полного расслабления.',
		description: 'Описание зоны бассейна и спа',
	})
	@IsString({ message: 'Описание должно быть строкой' })
	@IsNotEmpty({ message: 'Описание обязательно для заполнения' })
	@Length(6, 1500, {
		message: 'Описание должно содержать от 6 до 1500 символов',
	})
	description: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение обеденного зала (опционально)',
	})
	file?: any;
}

export class PoolSpaUpdateDto extends PartialType(PoolSpaCreateDto) {}

export class uploadSliderImagesDto {
	@ApiProperty({
		type: 'array',
		items: { type: 'string', format: 'binary' },
		required: false,
		description: 'Здесь можно загрузить несколько изображений слайдера',
	})
	files?: any[];
}

export class updateSliderDto {
	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение обеденного зала (опционально)',
	})
	file?: any;
}
