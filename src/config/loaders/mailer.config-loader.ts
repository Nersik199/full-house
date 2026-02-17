import type { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailerConfig } from '../definitions /mailer.config';

export function getMailerConfig(
  configService: ConfigService<MailerConfig>,
): MailerOptions {
  return {
    transport: {
      host: configService.getOrThrow<string>('MAILER_HOST', { infer: true }),
      port: configService.getOrThrow<number>('MAILER_PORT', { infer: true }),
      secure: false,
      auth: {
        user: configService.getOrThrow<string>('MAILER_LOGIN', { infer: true }),
        pass: configService.getOrThrow<string>('MAILER_PASSWORD', {
          infer: true,
        }),
      },
    },
    defaults: {
      from: `"Full House Hotel" ${configService.getOrThrow<string>('MAILER_LOGIN', { infer: true })}`,
    },
  };
}
