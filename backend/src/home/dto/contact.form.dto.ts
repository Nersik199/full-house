import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
} from 'class-validator';

export class ContactFormDto {
	@ApiProperty({
		example: 'Иван',
		description: 'Имя отправителя',
	})
	@IsString({ message: 'Имя должно быть строкой' })
	@IsNotEmpty({ message: 'Имя обязательно для заполнения' })
	@Length(2, 50, { message: 'Имя должно содержать от 2 до 50 символов' })
	firstName: string;

	@ApiProperty({
		example: 'Иванов',
		description: 'Фамилия отправителя',
	})
	@IsString({ message: 'Фамилия должна быть строкой' })
	@IsNotEmpty({ message: 'Фамилия обязательна для заполнения' })
	@Length(2, 50, { message: 'Фамилия должна содержать от 2 до 50 символов' })
	lastName: string;

	@ApiProperty({
		example: 'ivanov@example.com',
		description: 'Контактный e-mail',
	})
	@IsEmail({}, { message: 'Некорректный формат электронной почты' })
	@IsNotEmpty({ message: 'Email обязателен для заполнения' })
	email: string;

	@ApiProperty({
		example: '+79614082888',
		description: 'Номер телефона в международном формате',
	})
	@IsString({ message: 'Телефон должен быть строкой' })
	@IsNotEmpty({ message: 'Телефон обязателен для заполнения' })
	@Matches(/^\+?[1-9]\d{1,14}$/, {
		message: 'Некорректный формат телефона',
	})
	phone: string;

	@ApiPropertyOptional({
		example: 'Здравствуйте, меня интересует...',
		description: 'Текст сообщения',
		maxLength: 500,
	})
	@IsOptional()
	@IsString({ message: 'Сообщение должно быть строкой' })
	@Length(0, 500, { message: 'Сообщение не может превышать 500 символов' })
	message: string;
}
