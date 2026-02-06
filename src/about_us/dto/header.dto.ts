import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class HeaderAboutUsCreateDto {
  @ApiProperty({
    example: 'Наше меню',
    description: 'Основной заголовок раздела меню',
  })
  @IsString({ message: 'Title должен быть строкой' })
  @IsNotEmpty({ message: 'Title обязательно' })
  @Length(5, 200, { message: 'Title должен содержать от 5 до 200 символов' })
  title: string;

  @ApiProperty({
    example: 'Блюда, приготовленные с любовью и из свежих ингредиентов',
    description: 'Короткий подзаголовок для раздела меню',
  })
  @IsString({ message: 'SubTitle должен быть строкой' })
  @IsNotEmpty({ message: 'SubTitle обязательно' })
  @Length(6, 1500, {
    message: 'Sub title должен содержать от 6 до 1500 символов',
  })
  subTitle: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Изображение для шапки раздела меню (опционально)',
  })
  file?: any;
}

export class HeaderAboutUsUpdateDto extends PartialType(
  HeaderAboutUsCreateDto,
) {}
