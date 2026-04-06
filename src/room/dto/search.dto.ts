import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import dayjs from 'dayjs';

export class SearchBookingDto {
  @ApiProperty({
    description: 'Дата начала бронирования',
    example: dayjs().add(1, 'day').toISOString(),
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: dayjs().add(3, 'day').toISOString(),
    description: 'Дата окончания бронирования',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiPropertyOptional({
    description: 'Количество гостей (необязательно)',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  member?: number;
}
