import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import morgan from 'morgan';
import { Sequelize } from 'sequelize-typescript';
import { createAdmin } from '@/user/decorators/create.user.admin';
import { User } from '@/user/entities/user.entity';
import { AppModule } from './app.module';
import { swaggerBasicAuth } from './config/loaders/swagger.basic.auth';
import { setupSwagger } from './shared/utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const logger = new Logger(AppModule.name);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

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

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  swaggerBasicAuth(app, config);
  setupSwagger(app);

	await createAdmin(User, config);

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
