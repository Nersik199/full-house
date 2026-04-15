import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class HeaderPoolSpaCreateDto {
  @ApiProperty({
    example: 'Бассейн и SPA-зона',
    description: 'Основной заголовок зоны бассейна и SPA',
  })
  @IsString({ message: 'Title должен быть строкой' })
  @IsNotEmpty({ message: 'Title обязательно' })
  @Length(5, 200, { message: 'Title должен содержать от 5 до 200 символов' })
  title: string;

  @ApiProperty({
    example: 'Расслабьтесь в нашей SPA-зоне после активного дня',
    description: 'Короткий подзаголовок для зоны бассейна и SPA',
  })
  @IsString({ message: 'SubTitle должен быть строкой' })
  @IsNotEmpty({ message: 'SubTitle обязательно' })
  @Length(6, 500, { message: 'SubTitle должен содержать от 6 до 500 символов' })
  subTitle: string;

  @ApiProperty({
    example:
      'В нашей зоне вы найдёте современный бассейн, джакузи, сауну и зону отдыха. Идеальное место для расслабления и восстановления сил.',
    description: 'Подробное описание зоны бассейна и SPA',
  })
  @IsString({ message: 'Description должен быть строкой' })
  @IsNotEmpty({ message: 'Description обязательно' })
  @Length(6, 1500, {
    message: 'Description должен содержать от 6 до 1500 символов',
  })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Изображение для шапки раздела меню (опционально)',
  })
  file?: any;
}

export class HeaderPoolSpaUpdateDto extends PartialType(
  HeaderPoolSpaCreateDto,
) {}
