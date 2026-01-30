import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(5, 100)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}
