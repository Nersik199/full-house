import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class GetCartTicketsDto {
    @ApiProperty({
        example: [1, 2, 3],
        description: 'Массив идентификаторов билетов, добавленных в корзину',
        type: [Number],
    })
    @IsNotEmpty({ message: 'Массив IDs не должен быть пустым' })
    @IsArray({ message: 'Поле ids должно быть массивом' })
    @IsInt({ each: true, message: 'Каждый ID в массиве должен быть целым числом' })
    @Transform(({ value }) => {
        return Array.isArray(value) ? value.map(Number) : value;
    })
    ids: number[];
}