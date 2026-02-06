import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class HeaderRoomCreateDto {
  @ApiProperty({ example: 'Главный заголовок номера' })
  @IsString({ message: 'Title должен быть строкой' })
  @IsNotEmpty({ message: 'Title обязательно' })
  @Length(5, 200, { message: 'Title должен содержать от 5 до 200 символов' })
  title: string;

  @ApiProperty({ example: 'Подзаголовок с описанием номера' })
  @IsString({ message: 'SubTitle должен быть строкой' })
  @IsNotEmpty({ message: 'SubTitle обязательно' })
  @Length(6, 1500, {
    message: 'Sub title должен содержать от 6 до 1500 символов',
  })
  subTitle: string;

  @ApiProperty({ example: 'Подробное описание номера для гостей' })
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
    description: 'Можно загрузить одно изображение для header',
  })
  file?: any;
}

export class HeaderRoomUpdateDto extends PartialType(HeaderRoomCreateDto) {}
