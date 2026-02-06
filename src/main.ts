import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { setupSwagger } from './shared/utils/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import morgan from 'morgan';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger(AppModule.name);
  const sequelize = app.get(Sequelize);
  await sequelize.sync({ alter: true });
  const configService = app.get(ConfigService);
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
    }),
  );

  setupSwagger(app);

  await app
    .listen(configService.getOrThrow<number>('APPLICATION_PORT'))
    .then(() => {
      logger.log(
        `🚀 Server is running at http://localhost:${process.env.PORT ?? 3000}`,
      );

      logger.log(
        `Swagger docs available at: http://localhost:${
          process.env.PORT ?? 3000
        }/docs`,
      );
    });
  logger.log('Database synced with force: true (tables recreated)');
}
bootstrap();
