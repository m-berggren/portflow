import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
	JwtAuthGuard,
	LoginDto,
	RegisterDto,
	type UserContext,
} from '@portflow/shared-auth';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
	constructor(private authService: AuthService) {}

	@MessagePattern('auth.login')
	async login(loginDto: LoginDto) {
		return this.authService.login(loginDto.email, loginDto.password);
	}

	@MessagePattern('auth.register')
	async register(registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@MessagePattern('auth.profile')
	async getProfile(user: UserContext) {
		return {
			userId: user.userId,
			email: user.email,
			organizationId: user.organizationId,
			roles: user.roles,
		};
	}

	@MessagePattern('auth.refresh')
	async refreshToken(user: UserContext) {
		// Throws if invalid
		await this.authService.validateUser(user.userId);

		return {
			accessToken: this.authService.generateToken(user),
		};
	}
}
