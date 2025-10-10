import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
	CurrentUser,
	JwtAuthGuard,
	type UserContext,
} from '@portflow/shared-auth';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto.email, loginDto.password);
	}

	@Post('register')
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@CurrentUser() user: UserContext) {
		return {
			userId: user.userId,
			email: user.email,
			organizationId: user.organizationId,
			roles: user.roles,
		};
	}

	@UseGuards(JwtAuthGuard)
	@Post('refresh')
	async refreshToken(@CurrentUser() user: UserContext) {
		// Throws if invalid
		await this.authService.validateUser(user.userId);

		return {
			accessToken: this.authService.generateToken(user),
		};
	}
}
