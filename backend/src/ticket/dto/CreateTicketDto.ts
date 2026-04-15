import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @ApiProperty({
    example: '2026-04-07',
    description: 'Дата билета в формате YYYY-MM-DD',
  })
  @IsNotEmpty({ message: 'Дата обязательна' })
  @IsString({ message: 'Дата должна быть строкой' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Дата должна соответствовать формату YYYY-MM-DD',
  })
  date: string;

  @ApiProperty({
    example: 50,
    description: 'Общее количество доступных билетов на эту дату',
  })
  @IsNotEmpty({ message: 'Количество обязательно' })
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(0, { message: 'Количество не может быть отрицательным' })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    example: 1500,
    description: 'Базовая цена билета без учета скидки',
  })
  @IsNotEmpty({ message: 'Цена обязательна' })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 15,
    required: false,
    description: 'Размер скидки в процентах (от 0 до 100)',
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Скидка должна быть числом' })
  @Min(0, { message: 'Скидка не может быть меньше 0%' })
  @Max(100, { message: 'Скидка не может превышать 100%' })
  @Type(() => Number)
  discount?: number;
}
