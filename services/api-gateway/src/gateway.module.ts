import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import {
	JwtAuthGuard,
	JwtUserStrategy,
	SharedAuthModule,
} from '@portflow/shared-auth';
import Joi from 'joi';
import { createNatsClient } from './config/nats-client.factory';
import { AuthController } from './controllers/auth.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env', // Used when running natively outside container
			ignoreEnvFile: process.env.DOCKER === 'true', // Ignore if running through docker-compose file
			validationSchema: Joi.object({
				JWT_PUBLIC_KEY: Joi.string().required(),
				NATS_URL: Joi.string().required(),
				API_GATEWAY_PORT: Joi.number().default(3000),
				CORS_ORIGIN: Joi.string().required(),
			}),
		}),
		SharedAuthModule, // Shared local library for authentication checks
		ClientsModule.registerAsync([
			// Link services through factory method
			createNatsClient('IDENTITY_SERVICE'),
		]),
	],
	controllers: [AuthController],
	providers: [JwtAuthGuard, JwtUserStrategy],
})
export class GatewayModule {}
