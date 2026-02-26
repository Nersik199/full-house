import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
export class LodgeCreateDto {
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

  @ApiProperty({
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
    description: 'Подробное описание номера (от 6 до 1500 символов)',
  })
  @IsString({ message: 'Описание должно быть строкой' })
  @IsNotEmpty({ message: 'Описание обязательно' })
  @Length(6, 1500, {
    message: 'Описание должно содержать от 6 до 1500 символов',
  })
  description: string;

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

  @ApiProperty({
    example: 1,
    description: 'Количество ванных комнат в номере',
  })
  @IsNumber({}, { message: 'Количество ванных комнат должно быть числом' })
  @Type(() => Number)
  bathroom: number;

  @ApiProperty({
    example: 2,
    description: 'Максимальное количество гостей',
  })
  @IsNumber({}, { message: 'Количество гостей должно быть числом' })
  @IsNotEmpty({ message: 'Количество гостей обязательно' })
  @Type(() => Number)
  member: number;

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
    description: 'Разрешено ли курение в номере (true / false)',
  })
  @IsBoolean({ message: 'Поле "курение" должно быть логическим значением' })
  @IsOptional()
  @Type(() => Boolean)
  smoking: boolean;

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
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Массив изображений номера (можно загрузить несколько файлов)',
  })
  files?: any[];
}

export class LodgeUpdateDto extends PartialType(
  OmitType(LodgeCreateDto, ['files'] as const),
) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Изображение для домика (один файл)',
    required: false,
  })
  file?: any;
}
