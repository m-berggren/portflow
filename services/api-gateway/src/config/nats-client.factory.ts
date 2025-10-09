import { ConfigService } from '@nestjs/config';
import {
	type ClientsProviderAsyncOptions,
	Transport,
} from '@nestjs/microservices';

// Use factory method to register services to API Gateway
export function createNatsClient(name: string): ClientsProviderAsyncOptions {
	return {
		name,
		inject: [ConfigService],
		useFactory: (config: ConfigService) => ({
			transport: Transport.NATS,
			options: {
				servers: [config.getOrThrow<string>('NATS_URL')],
			},
		}),
	};
}
