import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PoolSpaCreateDto {
  @ApiProperty({
    example:
      'Просторная зона бассейна и спа с тёплой водой, удобными шезлонгами и атмосферой полного расслабления.',
    description: 'Описание зоны бассейна и спа',
  })
  @IsString({ message: 'Описание должно быть строкой' })
  @IsNotEmpty({ message: 'Описание обязательно для заполнения' })
  @Length(6, 1500, {
    message: 'Описание должно содержать от 6 до 1500 символов',
  })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Изображение обеденного зала (опционально)',
  })
  file?: any;
}

export class PoolSpaUpdateDto extends PartialType(PoolSpaCreateDto) {}
