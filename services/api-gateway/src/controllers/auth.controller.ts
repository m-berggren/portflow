import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
	CurrentUser,
	JwtAuthGuard,
	LoginDto,
	RegisterDto,
	type UserContext,
} from '@portflow/shared-auth';

@Controller('auth')
export class AuthController {
	constructor(@Inject('IDENTITY_SERVICE') private client: ClientProxy) {}

	@Post('login')
	async login(@Body() loginDto: LoginDto) {
		return this.client.send('auth.login', loginDto);
	}

	@Post('register')
	async register(@Body() registerDto: RegisterDto) {
		return this.client.send('auth.register', registerDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfile(@CurrentUser() user: UserContext) {
		return this.client.send('auth.profile', user);
	}

	@UseGuards(JwtAuthGuard)
	@Post('refresh')
	async refreshToken(@CurrentUser() user: UserContext) {
		return this.client.send('auth.refresh', user);
	}
}
