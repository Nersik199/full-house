import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export enum EntityField {
  ROOM = 'roomId',
  LODGE = 'lodgeId',
}

export class BookingCheckAvailabilityDto {
  @IsNotEmpty({ message: 'Поле entityField обязательно' })
  @IsEnum(EntityField, {
    message: 'Поле entityField должно быть ROOM или LODGE',
  })
  entityField: string;

  @IsNotEmpty({ message: 'ID сущности обязательно' })
  @IsNumber({}, { message: 'ID сущности должно быть числом' })
  @Type(() => Number)
  entityId: number;

  @IsNotEmpty({ message: 'Дата заезда обязательна' })
  @IsDate({ message: 'Дата заезда должна быть корректной датой' })
  @Type(() => Date)
  checkIn: Date;

  @IsNotEmpty({ message: 'Дата выезда обязательна' })
  @IsDate({ message: 'Дата выезда должна быть корректной датой' })
  @Type(() => Date)
  checkOut: Date;
}

export class CreateBookingDto {
  @IsNumber({}, { message: 'ID комнаты должно быть числом' })
  @Type(() => Number)
  roomId?: number;

  @IsNumber({}, { message: 'ID домика должно быть числом' })
  @Type(() => Number)
  lodgeId?: number;

  @IsNotEmpty({ message: 'Имя гостя обязательно' })
  @IsString({ message: 'Имя гостя должно быть строкой' })
  guestName: string;

  @IsNotEmpty({ message: 'Телефон гостя обязателен' })
  @IsString({ message: 'Телефон гостя должен быть строкой' })
  guestPhone: string;

  @IsNotEmpty({ message: 'Email гостя обязателен' })
  @IsString({ message: 'Email гостя должен быть строкой' })
  guestEmail: string;

  @IsNotEmpty({ message: 'Номер комнаты обязателен' })
  @IsNumber({}, { message: 'Номер комнаты должен быть числом' })
  @Type(() => Number)
  roomNumber: number;

  @IsNotEmpty({ message: 'Источник бронирования обязателен' })
  @IsString({ message: 'Источник бронирования должен быть строкой' })
  source: string;

  @IsNotEmpty({ message: 'Дата заезда обязательна' })
  @IsDate({ message: 'Дата заезда должна быть корректной датой' })
  @Type(() => Date)
  checkIn: Date;

  @IsNotEmpty({ message: 'Дата выезда обязательна' })
  @IsDate({ message: 'Дата выезда должна быть корректной датой' })
  @Type(() => Date)
  checkOut: Date;
}
