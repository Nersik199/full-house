import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class RoomCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 1500)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsBoolean()
  wifi: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  Bathroom: number;

  @ApiProperty()
  @IsBoolean()
  smoking: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  member: number;
}
