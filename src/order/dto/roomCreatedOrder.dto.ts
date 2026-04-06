import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsEmail,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@/shared/enums/payment-method.enum';
import dayjs from 'dayjs';

export class RoomCreatedOrderDto {
  @ApiProperty({ example: 101 })
  @IsNumber({}, { message: 'Номер комнаты должен быть числом' })
  @IsNotEmpty({ message: 'Номер комнаты обязателен' })
  @Type(() => Number)
  roomId: number;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_CARD,
  })
  @IsEnum(PaymentMethod)
  public method: PaymentMethod;

  @ApiProperty({ example: 2 })
  @IsNumber({}, { message: 'Количество гостей должно быть числом' })
  @IsNotEmpty({ message: 'Количество гостей обязательно' })
  @Type(() => Number)
  member: number;

  @ApiProperty({ example: 'Иван Иванов' })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно' })
  @Length(2, 100, {
    message: 'Имя должно содержать от 2 до 100 символов',
  })
  customerName: string;

  @ApiProperty({ example: 'ivan@test.com' })
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Email должен быть валидным' })
  @IsNotEmpty({ message: 'Email обязателен' })
  @Length(5, 100, {
    message: 'Email должен содержать от 5 до 100 символов',
  })
  customerEmail: string;

  @ApiProperty({ example: '+7 999 123-45-67' })
  @IsString({ message: 'Телефон должен быть строкой' })
  @IsNotEmpty({ message: 'Телефон обязателен' })
  @Length(5, 20, {
    message: 'Телефон должен содержать от 5 до 20 символов',
  })
  customerPhone: string;

  @ApiProperty({ example: 15000 })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @IsNotEmpty({ message: 'Цена обязательна' })
  @Type(() => Number)
  totalAmount: number;

  @ApiProperty({ example: dayjs().add(1, 'day').toISOString() })
  @IsNotEmpty({ message: 'Дата заезда обязательна' })
  @IsDate({ message: 'Дата заезда должна быть валидной датой' })
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: dayjs().add(3, 'day').toISOString() })
  @IsNotEmpty({ message: 'Дата выезда обязательна' })
  @IsDate({ message: 'Дата выезда должна быть валидной датой' })
  @Type(() => Date)
  endDate: Date;
}
