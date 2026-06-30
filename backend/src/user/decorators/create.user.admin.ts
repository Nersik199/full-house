import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { User } from '../entities/user.entity';
export async function createAdmin(
	userModel: typeof User,
	configService: ConfigService,
) {
	const email = configService.getOrThrow<string>('EMAIL_ADMIN', {
		infer: true,
	});

	const password = configService.getOrThrow<string>('PASSWORD_ADMIN', {
		infer: true,
	});


	if (!email || !password) {
		throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD missing');
	}

	const exists = await userModel.findOne({
		where: { email },
	});

	if (!exists) {
		await userModel.create({
			email,
			password: await argon2.hash(password),
			role: 'admin',
		});
	}
}
