import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtUserStrategy, SharedAuthModule } from '@portflow/shared-auth';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [
		SharedAuthModule,
		UserModule,
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				privateKey: configService.getOrThrow<string>('JWT_PRIVATE_KEY'),
				publicKey: configService.getOrThrow<string>('JWT_PUBLIC_KEY'),
				signOptions: {
					algorithm: 'RS256',
					expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtUserStrategy],
	exports: [AuthService],
})
export class AuthModule {}
