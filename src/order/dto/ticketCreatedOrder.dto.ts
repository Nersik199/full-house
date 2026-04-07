import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsEmail,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@/shared/enums/payment-method.enum';

export class TicketCreatedOrderDto {
  @ApiProperty({ example: 1, description: 'ID билета' })
  @IsNumber({}, { message: 'ID билета должен быть числом' })
  @IsNotEmpty({ message: 'ID билета обязателен' })
  @Type(() => Number)
  ticketId: number;

  @ApiProperty({ example: 1500, description: 'Цена за один билет' })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @IsNotEmpty({ message: 'Цена обязательна' })
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 2, description: 'Количество билетов' })
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @IsNotEmpty({ message: 'Количество обязательно' })
  @Min(1, { message: 'Минимум 1 билет' })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Способ оплаты',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_CARD,
  })
  @IsEnum(PaymentMethod)
  public method: PaymentMethod;

  @ApiProperty({ example: 'Александр Пушкин' })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя гостя обязательно' })
  @Length(2, 100, { message: 'Имя должно быть от 2 до 100 символов' })
  customerName: string;

  @ApiProperty({ example: 'pushkin@example.com' })
  @IsEmail({}, { message: 'Email должен быть валидным' })
  @IsNotEmpty({ message: 'Email обязателен' })
  customerEmail: string;

  @ApiProperty({ example: '+79991234567' })
  @IsString({ message: 'Телефон должен быть строкой' })
  @IsNotEmpty({ message: 'Телефон обязателен' })
  @Length(5, 20, { message: 'Телефон должен быть от 5 до 20 символов' })
  customerPhone: string;
}
