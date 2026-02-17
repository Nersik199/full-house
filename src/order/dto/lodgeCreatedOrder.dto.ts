import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { RoomCreatedOrderDto } from './roomCreatedOrder.dto';

export class LodgeCreatedOrderDto extends OmitType(RoomCreatedOrderDto, [
  'roomId',
] as const) {
  @ApiProperty({ example: 10 })
  @IsNumber({}, { message: 'ID жилья должен быть числом' })
  @IsNotEmpty({ message: 'ID жилья обязателен' })
  @Type(() => Number)
  lodgeId: number;
}
