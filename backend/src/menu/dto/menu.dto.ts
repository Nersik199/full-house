import { ApiProperty, ApiQuery, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
export class MenuCreateDto {
  @ApiProperty({
    example: 'Пицца Маргарита',
    description: 'Название блюда из меню (от 5 до 200 символов)',
  })
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название обязательно' })
  @Length(5, 200, {
    message: 'Название должно содержать от 5 до 200 символов',
  })
  title: string;

  @ApiProperty({
    example:
      'Классическая итальянская пицца с томатным соусом, моцареллой и свежим базиликом',
    description: 'Подробное описание блюда (от 6 до 1500 символов)',
  })
  @IsString({ message: 'Описание должно быть строкой' })
  @IsNotEmpty({ message: 'Описание обязательно' })
  @Length(6, 1500, {
    message: 'Описание должно содержать от 6 до 1500 символов',
  })
  description: string;

  @ApiProperty({
    example: 2500,
    description: 'Цена блюда в драмах (числовое значение)',
  })
  @IsNotEmpty({ message: 'Цена обязательна' })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Type(() => Number)
  price: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Изображение блюда (один файл)',
  })
  file?: any;
}

export class MenuUpdateDto extends PartialType(MenuCreateDto) {}
