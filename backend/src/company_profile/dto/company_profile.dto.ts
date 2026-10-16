import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsBoolean,
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
		required: false,
	})
	@IsOptional()
	@IsString({ message: 'Название компании должно быть строкой' })
	@Length(2, 200, {
		message: 'Название компании должно содержать от 2 до 200 символов',
	})
	nameCompany?: string;

	@ApiProperty({
		example: 'info@romashka.ru',
		description: 'Email компании',
		required: false,
	})
	@IsEmail({}, { message: 'Email должен быть корректным' })
	@IsOptional()
	mail?: string;

	@ApiProperty({
		example: '+7 (999) 123-45-67',
		description: 'Телефон компании',
	})
	@IsString({ message: 'Телефон должен быть строкой' })
	@IsNotEmpty({ message: 'Телефон обязателен' })
	tel: string;

	@ApiProperty({
		example: null,
		description: 'Показывать профиль в footer',
		required: false,
		nullable: true,
	})
	@Transform(({ value }) => {
		if (value === 'null' || value === '') return null;
		if (value === 'true') return true;
		if (value === 'false') return false;
		return value;
	})
	@IsOptional()
	@IsBoolean({ message: 'isFooter должен быть boolean или null' })
	isFooter?: boolean | null;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение для header блока (один файл)',
	})
	@IsOptional()
	file?: any;
}

export class CompanyProfileUpdateDto extends PartialType(
	CompanyProfileCreateDto,
) {}
