import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsEmail,
  IsEnum,
  Min,
  IsArray,
  ValidateNested,
  IsDate,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@/shared/enums/payment-method.enum';

class CartItemDto {
  @ApiProperty({ example: 101, description: 'Идентификатор билета' })
  @IsNumber({}, { message: 'ticketId должен быть числом' })
  @IsNotEmpty({ message: 'ID билета обязателен' })
  ticketId: number;

  @ApiProperty({ example: 2, description: 'Количество билетов' })
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(1, { message: 'Минимальное количество — 1' })
  @IsNotEmpty({ message: 'Количество обязательно' })
  quantity: number;
}

export class TicketCreatedOrderDto {
  @ApiProperty({
    type: [CartItemDto],
    description: 'Список выбранных билетов в корзине',
  })
  @IsArray({ message: 'Поле items должно быть массивом' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_CARD,
  })
  @IsEnum(PaymentMethod)
  public method: PaymentMethod;

  @ApiProperty({ example: 'Иван Иванов', description: 'Полное имя клиента' })
  @IsString({ message: 'Имя должно быть строкой' })
  @Length(2, 100, { message: 'Имя должно содержать от 2 до 100 символов' })
  @IsNotEmpty({ message: 'Имя клиента обязательно' })
  customerName: string;

  @ApiProperty({
    example: 'ivan@example.com',
    description: 'Электронная почта для связи',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  customerEmail: string;

  @ApiProperty({
    example: '+79001234567',
    description: 'Контактный номер телефона',
  })
  @IsString({ message: 'Телефон должен быть строкой' })
  @IsNotEmpty({ message: 'Номер телефона обязателен' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Введите корректный номер телефона в международном формате',
  })
  customerPhone: string;
}
