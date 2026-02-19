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
    description: 'Название блюда из меню',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  title: string;

  @ApiProperty({
    example:
      'Классическая итальянская пицца с томатным соусом, моцареллой и свежим базиликом',
    description: 'Подробное описание блюда',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 1500)
  description: string;

  @ApiProperty({
    example: 2500,
    description: 'Цена блюда в драмах',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Можно загрузить одно изображение для header',
  })
  file?: any;
}

export class MenuUpdateDto extends PartialType(MenuCreateDto) {}
