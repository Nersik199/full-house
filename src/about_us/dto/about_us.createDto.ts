import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AboutUsCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 1500)
  subTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 1500)
  description: string;
}

export class AboutUsUpdateDto extends PartialType(AboutUsCreateDto) {}
