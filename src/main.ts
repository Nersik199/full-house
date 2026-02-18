import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { setupSwagger } from './shared/utils/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const logger = new Logger(AppModule.name);
  const config = app.get(ConfigService);

  const sequelize = app.get(Sequelize);
  await sequelize.sync({ alter: true });

  app.set('trust proxy', true);
  app.use(
    morgan('dev', {
      stream: {
        write: (message: string) => {
          logger.log(message.trim());
        },
      },
    }),
  );
  app.use(
    ['/docs', '/docs-json', '/openapi.yaml'],
    expressBasicAuth({
      challenge: true,
      authorizeAsync: false,
      authorizer: (username: string, password: string) => {
        return (
          username === config.getOrThrow<string>('DOCS_USER') &&
          password === config.getOrThrow<string>('DOCS_PASSWORD')
        );
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  setupSwagger(app);

  const port = config.getOrThrow<number>('APPLICATION_PORT');

  try {
    await app.listen(port);

    logger.log(` Server is running at:  http://localhost:${port}`);
    logger.log(
      ` Documentation is available at:  http://localhost:${port}/docs`,
    );
  } catch (error) {
    logger.error(` Failed to start server: `, error);
    process.exit(1);
  }
}
bootstrap();
