import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class InitPaymentRequest {
  @IsNumber({}, { message: 'Номер комнаты должен быть числом' })
  @IsNotEmpty({ message: 'Номер комнаты обязателен' })
  @Type(() => Number)
  id: number;

  @IsNumber({}, { message: 'Номер комнаты должен быть числом' })
  @IsOptional({ message: 'Номер комнаты обязателен' })
  @Type(() => Number)
  bookingIds: number[];

  @IsNumber({}, { message: 'Количество билетов должно быть числом' })
  @Type(() => Number)
  @IsOptional()
  ticketQuantity?: number;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @IsNotEmpty({ message: 'Цена обязательна' })
  @Type(() => Number)
  totalAmount: number;

  @IsEmail()
  @IsOptional()
  public customerEmail?: string;

  @IsNotEmpty({ message: 'Дата начала обязательна' })
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty({ message: 'Дата начала обязательна' })
  @Type(() => Date)
  endDate: Date;
}
