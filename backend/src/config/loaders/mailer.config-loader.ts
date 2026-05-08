import type { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { MailerConfig } from '../definitions/mailer.config';

export function getMailerConfig(
	configService: ConfigService<MailerConfig>,
): MailerOptions {
	const port = configService.getOrThrow<number>('MAILER_PORT');

	return {
		transport: {
			host: configService.getOrThrow<string>('MAILER_HOST'),
			port: port,
			secure: port === 465,
			auth: {
				user: configService.getOrThrow<string>('MAILER_LOGIN'),
				pass: configService.getOrThrow<string>('MAILER_PASSWORD'),
			},
			tls: {
				rejectUnauthorized: false,
			},
			connectionTimeout: 20000,
		},
		defaults: {
			from: `"Full House Hotel" <${configService.getOrThrow<string>('MAILER_LOGIN')}>`,
		},
	};
}
