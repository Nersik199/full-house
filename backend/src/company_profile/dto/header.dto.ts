import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';

export enum HeaderCompanyType {
	TERMS_OF_SERVICE = 'terms_of_service',
	PRIVACY_POLICY = 'privacy_policy',
}

export class HeaderCompanyCreateDto {
	@ApiProperty({
		example: 'Наше меню',
		description: 'Основной заголовок раздела меню',
		required: false,
	})
	@IsString({ message: 'Title должен быть строкой' })
	@IsOptional()
	@Length(0, 100, { message: 'Title должен содержать от 5 до 100 символов' })
	title?: string;

	@ApiProperty({
		example: 'Блюда, приготовленные с любовью и из свежих ингредиентов',
		description: 'Короткий подзаголовок для раздела меню',
	})
	@IsString({ message: 'SubTitle должен быть строкой' })
	@IsNotEmpty({ message: 'SubTitle обязательно' })
	@Length(5, 50, {
		message: 'Sub title должен содержать от 5 до 50 символов',
	})
	subTitle: string;

	@ApiProperty({
		type: String,
		enum: HeaderCompanyType,
		required: false,
		nullable: true,
	})
	@IsOptional()
	@IsEnum(HeaderCompanyType, {
		message: 'Некорректный type',
	})
	type?: HeaderCompanyType | null;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение для шапки раздела меню (опционально)',
	})
	file?: any;
}

export class HeaderCompanyUpdateDto extends PartialType(
	HeaderCompanyCreateDto,
) {}
