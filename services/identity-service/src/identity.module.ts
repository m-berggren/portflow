import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SharedAuthModule } from '@portflow/shared-auth';
import Joi from 'joi';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { NatsTestController } from './nats-test.controller';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env', // Used when running natively outside container
			ignoreEnvFile: process.env.DOCKER === 'true', // Ignore if running through docker-compose file
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				IDENTITY_SERVICE_PORT: Joi.number().default(3001),
				CORS_ORIGIN: Joi.string().required(),
				NODE_ENV: Joi.string().required(),
				NATS_URL: Joi.string().required(),
			}),
		}),
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
				},
			}),
			inject: [ConfigService],
		}),
		PrismaModule,
		SharedAuthModule, // Shared local library for authentication checks
		AuthModule,
		UserModule,
		RolesModule,
		OrganizationsModule,
		ApiKeysModule,
	],
	controllers: [AuthController, NatsTestController],
	providers: [AuthService, UserService],
})
export class IdentityModule {}
