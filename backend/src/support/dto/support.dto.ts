import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum SupportType {
	TERMS = 'terms',
	PRIVACY = 'privacy',
}

export class SupportCreateDto {
	@ApiProperty({
		enum: SupportType,
		example: SupportType.TERMS,
		description:
			'Тип документа: terms — Условия обслуживания, privacy — Политика конфиденциальности',
	})
	@IsEnum(SupportType, {
		message: 'Type должен быть terms или privacy',
	})
	@IsNotEmpty({ message: 'Type обязательно' })
	type: SupportType;

	@ApiProperty({
		example:
			'<h1>Условия обслуживания</h1><p>Текст условий обслуживания...</p>',
		description: 'HTML-содержимое документа',
	})
	@IsString({ message: 'Content должен быть строкой' })
	@IsNotEmpty({ message: 'Content обязательно' })
	content: string;
}

export class SupportUpdateDto extends PartialType(SupportCreateDto) {}
