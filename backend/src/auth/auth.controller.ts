import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: AuthDto) {
		return await this.authService.register(dto);
	}
	@Post('admin/login')
	async login(@Body() dto: AuthDto) {
		return await this.authService.validateUser(dto.email, dto.password);
	}
}
