import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AboutUsCreateDto {
	@ApiProperty({
		example:
			'Просторный и уютный обеденный зал с комфортной атмосферой для гостей.',
		description: 'Описание обеденного зала',
	})
	@IsString({ message: 'Описание должно быть строкой' })
	@IsNotEmpty({ message: 'Описание обязательно для заполнения' })
	@Length(5, 500)
	description: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
		description: 'Изображение обеденного зала (опционально)',
	})
	file?: any;
}

export class AboutUsUpdateDto extends PartialType(AboutUsCreateDto) {}
