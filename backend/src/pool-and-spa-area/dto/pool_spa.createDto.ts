import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';

export class PoolSpaCreateDto {
	@ApiProperty({
		example: 'Релакс и восстановление в нашей аква-зоне',
		description: 'Заголовок блока бассейна и спа',
	})
	@IsString({ message: 'Заголовок должен быть строкой' })
	@IsNotEmpty({ message: 'Заголовок обязателен для заполнения' })
	@Length(5, 50, {
		message: 'Заголовок должен содержать от 5 до 50 символов',
	})
	title: string;

	@ApiProperty({
		example:
			'Просторная зона бассейна и спа с тёплой водой, удобными шезлонгами и атмосферой полного расслабления.',
		description: 'Описание зоны бассейна и спа',
	})
	@IsString({ message: 'Описание должно быть строкой' })
	@IsNotEmpty({ message: 'Описание обязательно для заполнения' })
	@Length(5, 500, {
		message: 'Описание должно содержать от 5 до 500 символов',
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

	@ApiPropertyOptional({
		type: [String],
		description: 'Массив URL-адресов оставшихся изображений',
		example: [
			'https://030672cc-252a-4845-94b8-9db9878b484d.selstorage.ru/rooms/b572e5a3-4807-45e5-aea6-f5bf0e67449a.jpg',
			'https://030672cc-252a-4845-94b8-9db9878b484d.selstorage.ru/rooms/b572e5a3-4807-45e5-aea6-f5bf0e67449a.jpg',
		],
	})
	@IsOptional()
	@Transform(({ value }) => {
		if (typeof value === 'string') {
			const trimmed = value.trim();

			if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
				try {
					const parsed = JSON.parse(trimmed);
					return Array.isArray(parsed) ? parsed : [trimmed];
				} catch {}
			}

			if (trimmed.includes(',')) {
				return trimmed
					.split(',')
					.map(item => item.trim())
					.filter(Boolean);
			}

			return trimmed ? [trimmed] : [];
		}

		if (Array.isArray(value)) {
			return value.flatMap(item =>
				typeof item === 'string' && item.includes(',')
					? item.split(',').map(i => i.trim())
					: item,
			);
		}

		return value;
	})
	@IsArray()
	@IsString({ each: true })
	images?: string[];
}
