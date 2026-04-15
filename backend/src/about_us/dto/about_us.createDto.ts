import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AboutUsCreateDto {
  @ApiProperty({
    example: 'Наша компания предоставляет лучшие услуги...',
    description: 'Текст описания раздела "О нас"',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 1500)
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Изображение для шапки раздела меню (опционально)',
  })
  file?: any;
}

export class AboutUsUpdateDto extends PartialType(AboutUsCreateDto) {}
