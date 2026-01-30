import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sequelize = app.get(Sequelize);

  await sequelize.sync({ alter: true });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Social API')
    .setDescription('The Social API description')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer-Token',
    )
    .setContact('Your Name', 'https://yourwebsite.com', 'xxx@test.com')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000).then(() => {
    console.log(
      `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
    );
    console.log(
      `Swagger docs available at: http://localhost:${
        process.env.PORT ?? 3000
      }/docs`,
    );
  });

  console.log('Database synced with force: true (tables recreated)');
}
bootstrap();
