import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
				JWT_PUBLIC_KEY: Joi.string().required(),
				JWT_PRIVATE_KEY: Joi.string().required(),
				JWT_EXPIRES_IN: Joi.string().required(),
				JWT_PUBLIC_API_KEY: Joi.string().required(),
				JWT_PRIVATE_API_KEY: Joi.string().required(),
				JWT_API_EXPIRES_IN: Joi.string().required(),
			}),
		}),
		PrismaModule,
		SharedAuthModule, // Shared local library for authentication checks
		AuthModule,
		UserModule,
		RolesModule,
		OrganizationsModule,
		ApiKeysModule,
	],
	controllers: [],
	providers: [UserService],
})
export class IdentityModule {}
