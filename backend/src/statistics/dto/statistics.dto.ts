import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DateFilterDto {
  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Дата начала периода',
  })
  @IsOptional()
  @IsString({ message: 'startDate должен быть строкой' })
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-01-31',
    description: 'Дата конца периода',
  })
  @IsOptional()
  @IsString({ message: 'endDate должен быть строкой' })
  endDate?: string;
}