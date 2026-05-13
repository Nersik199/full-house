import {
	ApiProperty,
	ApiPropertyOptional,
	OmitType,
	PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsIn,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';

export class RoomCreateDto {
	@ApiProperty({
		example: 'Стандартный номер',
		description: 'Название номера (от 5 до 200 символов)',
	})
	@IsString({ message: 'Название должно быть строкой' })
	@IsNotEmpty({ message: 'Название обязательно' })
	@Length(5, 200, {
		message: 'Название должно содержать от 5 до 200 символов',
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
			'Категория номера:  Standard, Comfort, Luxury, Family, Presidential',
	})
	@IsString()
	@IsIn(['Standard', 'Comfort', 'Luxury', 'Family', 'Presidential'], {
		message: 'Неверная категория номера',
	})
	category: 'Standard' | 'Comfort' | 'Luxury' | 'Family' | 'Presidential';

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
	@ApiProperty({
		example: 1000,
		description: 'Цена за один час проживания',
	})
	@IsNumber({}, { message: 'Цена должна быть числом' })
	@IsOptional({ message: 'Цена за один час проживания не обязателна' })
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
	@Type(() => Boolean)
	wifi: boolean;

	@ApiProperty({
		example: false,
		description: 'Наличие холодильника (true / false)',
	})
	@IsBoolean({ message: 'refrigerator должно быть логическим значением' })
	@IsOptional()
	@Type(() => Boolean)
	refrigerator?: boolean;

	@ApiProperty({
		example: false,
		description: 'Наличие кондиционера (true / false)',
	})
	@IsBoolean({ message: 'airConditioner должно быть логическим значением' })
	@IsOptional()
	@Type(() => Boolean)
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

	@ApiProperty({
		example: false,
		description: 'Наличие отдельной гостиной (true / false)',
	})
	@IsBoolean({ message: 'livingRoom должно быть логическим значением' })
	@IsOptional()
	@Type(() => Boolean)
	livingRoom?: boolean;

	@ApiProperty({
		example: false,
		description: 'Наличие столовой зоны (true / false)',
	})
	@IsBoolean({ message: 'diningRoom должно быть логическим значением' })
	@IsOptional()
	@Type(() => Boolean)
	diningRoom?: boolean;

	@ApiProperty({
		example: false,
		description: 'Наличие балкона (true / false)',
	})
	@IsBoolean({ message: 'balcony должно быть логическим значением' })
	@IsOptional()
	@Type(() => Boolean)
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
	@ApiProperty({
		type: 'string',
		format: 'binary',
		description: 'Изображение для номера номера (один файл)',
		required: false,
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
