import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class HeaderHomeCreateDto {
  @ApiProperty({
    example: 'Комфорт и уют для вашего идеального отдыха.',
    description: 'Основной заголовок раздела главная',
  })
  @IsString({ message: 'Title должен быть строкой' })
  @IsNotEmpty({ message: 'Title обязательно' })
  @Length(5, 200, { message: 'Title должен содержать от 5 до 200 символов' })
  title: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Изображение для шапки раздела меню (опционально)',
  })
  file?: any;
}

export class HeaderHomeUpdateDto extends PartialType(HeaderHomeCreateDto) {}
