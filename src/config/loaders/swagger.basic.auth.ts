import { ConfigService } from '@nestjs/config';
import expressBasicAuth from 'express-basic-auth';
import { INestApplication } from '@nestjs/common';
import { SwaggerAuthConfig } from '../definitions/swagger.auth';

export function swaggerBasicAuth(
  app: INestApplication,
  configService: ConfigService<SwaggerAuthConfig>,
) {
  const username = configService.getOrThrow<string>('DOCS_USER', {
    infer: true,
  });

  const password = configService.getOrThrow<string>('DOCS_PASSWORD', {
    infer: true,
  });

  app.use(
    ['/docs', '/docs-json', '/openapi.yaml'],
    expressBasicAuth({
      challenge: true,
      authorizeAsync: false,
      authorizer: (user, pass) => user === username && pass === password,
    }),
  );
}
