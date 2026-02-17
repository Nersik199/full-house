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
  @ApiProperty({ example: 'Стандартный номер' })
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название обязательно' })
  @Length(5, 200, {
    message: 'Название должно содержать от 5 до 200 символов',
  })
  title: string;

  @ApiProperty({ example: 'Уютный номер с видом на город' })
  @IsString({ message: 'Описание должно быть строкой' })
  @IsNotEmpty({ message: 'Описание обязательно' })
  @Length(6, 1500, {
    message: 'Описание должно содержать от 6 до 1500 символов',
  })
  description: string;

  @ApiProperty({ example: 101 })
  @IsNumber({}, { message: 'Номер комнаты должен быть числом' })
  @IsNotEmpty({ message: 'Номер комнаты обязателен' })
  @Type(() => Number)
  roomNumber: number;

  @ApiProperty({ example: 15000 })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @IsNotEmpty({ message: 'Цена обязательна' })
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: 'Количество ванных комнат должно быть числом' })
  @Type(() => Number)
  bathroom: number;

  @ApiProperty({ example: 2 })
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

  @ApiProperty({ example: false })
  @IsBoolean({ message: 'Wi-Fi должен быть логическим значением' })
  @IsOptional()
  @Type(() => Boolean)
  wifi: boolean;

  @ApiProperty({ example: false })
  @IsBoolean({ message: 'Поле "курение" должно быть логическим значением' })
  @IsOptional()
  @Type(() => Boolean)
  smoking: boolean;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Здесь можно загрузить несколько изображений номера',
  })
  files?: any[];
}

export class LodgeUpdateDto extends PartialType(
  OmitType(LodgeCreateDto, ['files'] as const),
) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Можно загрузить одно изображение для header',
    required: false,
  })
  file?: any;
}
