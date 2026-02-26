import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';

export class CreateBookingWalkInDto {
  @ApiProperty({
    example: 3,
    description: 'ID комнаты, которую гость хочет забронировать',
  })
  @IsNumber({}, { message: 'ID комнаты должно быть числом' })
  @IsNotEmpty()
  @Type(() => Number)
  roomId: number;

  @ApiProperty({
    example: 'Иван Петров',
    description: 'Полное имя гостя',
  })
  @IsNotEmpty({ message: 'Имя гостя обязательно' })
  @IsString({ message: 'Имя гостя должно быть строкой' })
  guestName: string;

  @ApiProperty({
    example: '+7 999 123-45-67',
    description: 'Контактный номер телефона гостя',
  })
  @IsNotEmpty({ message: 'Телефон гостя обязателен' })
  @IsString({ message: 'Телефон гостя должен быть строкой' })
  guestPhone: string;

  @ApiProperty({
    example: 'ivan.petrov@mail.ru',
    description: 'Email адрес гостя',
  })
  @IsNotEmpty({ message: 'Email гостя обязателен' })
  @IsString({ message: 'Email гостя должен быть строкой' })
  guestEmail: string;

  @ApiProperty({
    example: 205,
    description: 'Фактический номер комнаты в отеле',
  })
  @IsNotEmpty({ message: 'Номер комнаты обязателен' })
  @IsNumber({}, { message: 'Номер комнаты должен быть числом' })
  @Type(() => Number)
  roomNumber: number;

  @ApiProperty({
    example: 'walk-in',
    description: 'Источник бронирования (бронирование на месте)',
  })
  @IsNotEmpty({ message: 'Источник бронирования обязателен' })
  @IsString({ message: 'Источник бронирования должен быть строкой' })
  source: string;

  @ApiProperty({
    example: dayjs().add(1, 'day').toISOString(),
    description: 'Дата заезда (формат YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'Дата заезда обязательна' })
  @IsDate({ message: 'Дата заезда должна быть корректной датой' })
  @Type(() => Date)
  checkIn: Date;

  @ApiProperty({
    example: dayjs().add(3, 'day').toISOString(),
    description: 'Дата выезда (формат YYYY-MM-DD)',
  })
  @IsNotEmpty({ message: 'Дата выезда обязательна' })
  @IsDate({ message: 'Дата выезда должна быть корректной датой' })
  @Type(() => Date)
  checkOut: Date;
}
