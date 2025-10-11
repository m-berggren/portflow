import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IdentityModule } from './identity.module';

async function bootstrap() {
	const logger = new Logger('Bootstrap');

	const configService = new ConfigService();
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		IdentityModule,
		{
			transport: Transport.NATS,
			options: {
				servers: [configService.getOrThrow<string>('NATS_URL')],
			},
		},
	);

	await app.listen();

	logger.log(`Identity Service started at ${new Date().toISOString()}`);
}

bootstrap();
