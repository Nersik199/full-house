import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email обязателен' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @Length(5, 100, {
    message: 'Email должен содержать от 5 до 100 символов',
  })
  email: string;

  @ApiProperty({ example: 'StrongPassword123' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @Length(6, 100, {
    message: 'Пароль должен содержать от 6 до 100 символов',
  })
  password: string;
}
