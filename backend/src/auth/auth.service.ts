import {
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/user.service';

import { AuthDto } from './dto/auth.dto';
import { IAdmin } from './types/types';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	constructor(
		private usersService: UserService,
		private jwtService: JwtService,
	) {}

	// async register(dto: AuthDto) {
	// 	return await this.usersService.create(dto);
	// }

	async validateUser(email: string, password: string) {
		const user = await this.usersService.getByEmail(email);
		if (!user) {
			throw new NotFoundException('Invalid email or password');
		}
		const verifyUserPassword = await argon2.verify(user.password, password);
		if (!verifyUserPassword) {
			throw new UnauthorizedException('Invalid email or password');
		}

		return this.createToken(user);
	}

	async createToken(user: IAdmin) {
		const { id, email, role } = user;
		return {
			id,
			email,
			role,
			bearerToken: this.jwtService.sign({
				email: user.email,
				id: user.id,
				role: user.role,
			}),
		};
	}
}
