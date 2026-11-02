import {
	ApiProperty,
	ApiPropertyOptional,
	OmitType,
	PartialType,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
} from 'class-validator';

export class KaraokeCreateDto {
	@ApiProperty({
		example: 'Комфортабельный зал караоке с профессиональным оборудованием',
		description: 'Описание караоке',
	})
	@IsString({ message: 'Описание должно быть строкой' })
	@IsNotEmpty({ message: 'Описание обязательно' })
	@Length(5, 1000, {
		message: 'Описание должно содержать от 5 до 1000 символов',
	})
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
		type: 'array',
		items: { type: 'string', format: 'binary' },
		required: false,
		description: 'Массив изображений караоке',
	})
	files?: any[];
}

export class KaraokeUpdateDto extends PartialType(
	OmitType(KaraokeCreateDto, ['files'] as const),
) {
	@ApiPropertyOptional({
		type: [String],
		description: 'Массив URL оставшихся изображений',
		example: [
			'https://example.com/karaoke/image1.jpg',
			'https://example.com/karaoke/image2.jpg',
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

	@ApiPropertyOptional({
		type: 'string',
		format: 'binary',
		description: 'Новое изображение караоке',
	})
	file?: any;
}
