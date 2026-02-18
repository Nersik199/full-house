import { ConfigService } from '@nestjs/config';
import expressBasicAuth from 'express-basic-auth';
import { SwaggerAuthConfig } from '../definitions/swagger.auth';

export function swaggerBasicAuth(
  configService: ConfigService<SwaggerAuthConfig>,
) {
  return expressBasicAuth({
    challenge: true,
    authorizeAsync: false,
    authorizer: (username: string, password: string) => {
      return (
        username ===
          configService.getOrThrow<string>('DOCS_USER', { infer: true }) &&
        password ===
          configService.getOrThrow<string>('DOCS_PASSWORD', { infer: true })
      );
    },
  });
}
