import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';

export class CompanyProfileCreateDto {
	@ApiProperty({
		example: 'ООО Ромашка',
		description: 'Название компании (от 2 до 200 символов)',
	})
	@IsString({ message: 'Название компании должно быть строкой' })
	@IsNotEmpty({ message: 'Название компании обязательно' })
	@Length(2, 200, {
		message: 'Название компании должно содержать от 2 до 200 символов',
	})
	nameCompany: string;

	@ApiProperty({
		example: 'info@romashka.ru',
		description: 'Email компании',
	})
	@IsEmail({}, { message: 'Email должен быть корректным' })
	@IsNotEmpty({ message: 'Email обязателен' })
	mail: string;

	@ApiProperty({
		example: '+7 (999) 123-45-67',
		description: 'Телефон компании',
	})
	@IsString({ message: 'Телефон должен быть строкой' })
	@IsNotEmpty({ message: 'Телефон обязателен' })
	tel: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение для header блока (один файл)',
	})
	file?: any;
}
export class CompanyProfileUpdateDto extends PartialType(
	CompanyProfileCreateDto,
) {}
