import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
	const logger = new Logger('Bootstrap');

	// Create HTTP application (identity-service goes not go through api-gateway)
	const app = await NestFactory.create(GatewayModule);

	// Get from ConfigService
	const configService = app.get(ConfigService);
	const port = configService.getOrThrow<number>('API_GATEWAY_PORT');
	const natsUrl = configService.getOrThrow<string>('NATS_URL');
	const corsOrigin = configService.getOrThrow<string>('CORS_ORIGIN');

	// Validation
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	// CORS with detailed settings
	app.enableCors({
		origin: corsOrigin,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});

	// Set a global API prefix & versioning when needed
	app.setGlobalPrefix('api');

	/* app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    }); */

	// Allow NATS connections from services (SSE usage)
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.NATS,
		options: {
			servers: [natsUrl],
		},
	});

	await app.startAllMicroservices();
	logger.log(`NATS connected: ${natsUrl}`);

	await app.listen(port);
	logger.log(`API Gateway running on: http://localhost:${port}`);
	logger.log(`Accepting requests from: ${corsOrigin}`);
}
bootstrap();
