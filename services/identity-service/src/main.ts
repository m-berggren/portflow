import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { IdentityModule } from './identity.module';

async function bootstrap() {
	const logger = new Logger('Bootstrap');

	// Create normal HTTP application first, then attach NATS
	const app = await NestFactory.create(IdentityModule);
	const configService = app.get(ConfigService);

	const port = configService.getOrThrow<number>('IDENTITY_SERVICE_PORT');
	const nodeEnv = configService.get<string>('NODE_ENV', 'development');

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	// CORS configuration
	if (nodeEnv === 'development') {
		// Allow all localhost ports during development
		app.enableCors({
			origin: /^http:\/\/localhost:\d+$/,
			credentials: true,
		});
	} else {
		// Only specific origins allowed during production
		const corsOrigin = configService
			.getOrThrow<string>('CORS_ORIGIN')
			.split(',')
			.map((o) => o.trim());

		app.enableCors({
			origin: corsOrigin,
			credentials: true,
			methods: ['GET', 'POST', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		});
	}

	// For all endpoints but auth we enable connections through NATS with api-gateway
	app.connectMicroservice({
		transport: Transport.NATS,
		options: {
			servers: [configService.getOrThrow<string>('NATS_URL')],
		},
	});

	await app.startAllMicroservices();

	await app.listen(port);
	logger.log(`Identity Service (HTTP) running on: http://localhost:${port}`);
}

bootstrap();
