import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
	return new DocumentBuilder()
		.setTitle('Full House API')
		.setDescription('Backend API для сайта отеля Full House')
		.setVersion('1.0.0')
		.setTermsOfService('https://fullhouseone.ru/')
		.setDescription(
			'Backend API для сайта отеля Full House. ' +
				'JSON спецификация доступна по адресу: https://api.fullhouseone.ru/docs-json And https://api.fullhouseone.ru/openapi.yaml',
		)
		.setContact(
			'Full House Support',
			'https://fullhouseone.ru/',
			'support@fullhouse.ru',
		)

		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
			'Authorization',
		)
		.setLicense('AGPLv3', 'https://github.com/Nersik199/full-house')
		.build();
}
