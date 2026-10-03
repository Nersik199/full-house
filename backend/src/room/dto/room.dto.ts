import {
	ApiProperty,
	ApiPropertyOptional,
	OmitType,
	PartialType,
} from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsIn,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	ValidateNested,
} from 'class-validator';

export class SleepingPlaceDto {
	@ApiProperty({
		example: 'single_bed',
		enum: [
			'single_bed',
			'double_bed',
			'sofa',
			'double_sofa',
			'one_and_half_sofa',
			'chair',
		],
	})
	@IsString()
	@IsIn([
		'single_bed',
		'double_bed',
		'sofa',
		'double_sofa',
		'one_and_half_sofa',
		'chair',
	])
	type:
		| 'single_bed'
		| 'double_bed'
		| 'sofa'
		| 'double_sofa'
		| 'one_and_half_sofa'
		| 'chair';

	@ApiProperty({
		example: 2,
	})
	@IsNumber()
	@Type(() => Number)
	count: number;
}

function transformSleepingPlaces(value: any) {
	if (value === undefined || value === null || value === '') return [];

	let parsed = value;

	if (typeof parsed === 'string') {
		try {
			parsed = JSON.parse(parsed);
		} catch {
			return value;
		}
	}

	if (Array.isArray(parsed)) {
		parsed = parsed.map(item => {
			if (typeof item === 'string') {
				try {
					return JSON.parse(item);
				} catch {
					return item;
				}
			}
			return item;
		});
		return parsed.map(item => plainToInstance(SleepingPlaceDto, item));
	}

	return parsed;
}

export class RoomCreateDto {
	@ApiProperty({
		example: 'Стандартный номер',
		description: 'Название номера (от 5 до 200 символов)',
	})
	@IsString({ message: 'Название должно быть строкой' })
	@IsNotEmpty({ message: 'Название обязательно' })
	@Length(2, 50, {
		message: 'Название должно содержать от 2 до 50 символов',
	})
	title: string;

	@ApiPropertyOptional({
		example:
			'Вместимость — 3 человека (2 взрослых + 1 ребёнок). Цена указана за 2-х.',
		description: 'Краткое дополнительное описание номера (необязательно)',
	})
	@IsString({ message: 'SubTitle должен быть строкой' })
	@Length(5, 200, {
		message: 'SubTitle должен содержать от 5 до 200 символов',
	})
	@IsOptional()
	subTitle?: string;

	@ApiProperty({
		example: 'Уютный номер с видом на город',
		description: 'Подробное описание номера (от 5 до 1000 символов)',
	})
	@IsString({ message: 'Описание должно быть строкой' })
	@IsNotEmpty({ message: 'Описание обязательно' })
	@Length(5, 1000, {
		message: 'Описание должно содержать от 5 до 1000 символов',
	})
	description: string;

	@ApiProperty({
		example: 'Standard',
		description:
			'Категория номера: Standard, Comfort, JuniorSuite, Luxury, Family, Presidential',
	})
	@IsString()
	@IsIn(
		['Standard', 'Comfort', 'JuniorSuite', 'Luxury', 'Family', 'Presidential'],
		{
			message: 'Неверная категория номера',
		},
	)
	category:
		| 'Standard'
		| 'Comfort'
		| 'JuniorSuite'
		| 'Luxury'
		| 'Family'
		| 'Presidential';

	@ApiProperty({
		example: 101,
		description: 'Уникальный номер комнаты',
	})
	@IsNumber({}, { message: 'Номер комнаты должен быть числом' })
	@IsNotEmpty({ message: 'Номер комнаты обязателен' })
	@Type(() => Number)
	roomNumber: number;

	@ApiProperty({
		example: 15000,
		description: 'Цена за одну ночь проживания',
	})
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@IsNotEmpty({ message: 'Цена обязательна' })
	@Type(() => Number)
	price: number;

	@ApiPropertyOptional({
		example: 1000,
		description: 'Цена за один час проживания',
	})
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@IsOptional()
	@Type(() => Number)
	hourlyPrice?: number;

	@ApiProperty({
		example: 1,
		description: 'Количество ванных комнат в номере',
	})
	@IsNumber({}, { message: 'Количество ванных комнат должно быть числом' })
	@Type(() => Number)
	bathroom: number;

	@ApiProperty({
		example: 2,
		description: 'Количество взрослых',
	})
	@IsNumber({}, { message: 'Количество взрослых должно быть числом' })
	@IsNotEmpty({ message: 'Количество взрослых обязательно' })
	@Type(() => Number)
	adults: number;

	@ApiProperty({
		example: 1,
		description: 'Количество детей',
	})
	@IsNumber({}, { message: 'Количество детей должно быть числом' })
	@IsOptional()
	@Type(() => Number)
	children?: number;

	@ApiProperty({
		example: 1,
		description: 'Количество телевизоров в номере',
	})
	@IsNumber({}, { message: 'Количество телевизоров должно быть числом' })
	@IsNotEmpty({ message: 'Количество телевизоров обязательно' })
	@Type(() => Number)
	tv: number;

	@ApiProperty({
		example: false,
		description: 'Наличие Wi-Fi в номере (true / false)',
	})
	@IsBoolean({ message: 'Wi-Fi должен быть логическим значением' })
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	wifi: boolean;

	@ApiProperty({
		example: false,
		description: 'Наличие холодильника (true / false)',
	})
	@IsBoolean({ message: 'refrigerator должно быть логическим значением' })
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	refrigerator?: boolean;

	@ApiProperty({
		example: false,
		description: 'Наличие кондиционера (true / false)',
	})
	@IsBoolean({ message: 'airConditioner должно быть логическим значением' })
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	airConditioner?: boolean;

	@ApiProperty({
		example: 2,
		description: 'Количество кроватей в номере',
	})
	@IsNumber({}, { message: 'bedCount должно быть числом' })
	@IsOptional()
	@Type(() => Number)
	bedCount?: number;

	@ApiProperty({
		example: 'single',
		description: 'Тип кровати: single или double',
	})
	@IsString({ message: 'bedType должно быть строкой' })
	@IsOptional()
	bedType?: 'single' | 'double';

	@ApiPropertyOptional({
		type: [SleepingPlaceDto],
		example: [
			{ type: 'single_bed', count: 2 },
			{ type: 'sofa', count: 1 },
		],
		description: 'Спальные места в номере',
	})
	@IsOptional()
	@Transform(({ value }) => transformSleepingPlaces(value))
	@ValidateNested({ each: true })
	sleepingPlaces?: SleepingPlaceDto[];

	@ApiProperty({
		example: false,
		description: 'Наличие отдельной гостиной (true / false)',
	})
	@IsBoolean({ message: 'livingRoom должно быть логическим значением' })
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	livingRoom?: boolean;

	@ApiProperty({
		example: false,
		description: 'Наличие столовой зоны (true / false)',
	})
	@IsBoolean({ message: 'diningRoom должно быть логическим значением' })
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	diningRoom?: boolean;

	@ApiProperty({
		example: false,
		description: 'Наличие балкона (true / false)',
	})
	@IsBoolean({ message: 'balcony должно быть логическим значением' })
	@IsOptional()
	@Transform(({ value }) => value === 'true' || value === true)
	balcony?: boolean;

	@ApiProperty({
		type: 'array',
		items: { type: 'string', format: 'binary' },
		required: false,
		description: 'Массив изображений номера (можно загрузить несколько файлов)',
	})
	files?: any[];
}

export class RoomUpdateDto extends PartialType(
	OmitType(RoomCreateDto, ['files'] as const),
) {
	@ApiPropertyOptional({
		type: [SleepingPlaceDto],
		description:
			'Массив спальных мест. Передайте новый полный массив для обновления',
	})
	@IsOptional()
	@Transform(({ value }) => transformSleepingPlaces(value))
	@ValidateNested({ each: true })
	sleepingPlaces?: SleepingPlaceDto[];

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

	@ApiPropertyOptional({
		type: 'string',
		format: 'binary',
		description: 'Изображение для номера (один файл)',
	})
	file?: any;
}

export class GetAllRoomsDto {
	@ApiProperty({
		description: 'Категория номера',
		enum: ['Standard', 'Comfort', 'Luxury', 'Family', 'Presidential'],
		example: 'Standard',
	})
	@IsString()
	@IsIn(['Standard', 'Comfort', 'Luxury', 'Family', 'Presidential'], {
		message: 'Неверная категория номера',
	})
	@IsOptional()
	category: 'Standard' | 'Comfort' | 'Luxury' | 'Family' | 'Presidential';
}
