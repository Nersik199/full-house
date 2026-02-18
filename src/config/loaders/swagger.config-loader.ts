import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Full House API')
    .setDescription('Backend API для сайта отеля Full House')
    .setVersion('1.0.0')
    .setTermsOfService('https://fullhousehotel.ru')
    .setContact(
      'Full House Support',
      'https://full-house-production.up.railway.app/docs',
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
