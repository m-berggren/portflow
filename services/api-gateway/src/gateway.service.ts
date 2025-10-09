import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
	constructor(
		@Inject('IDENTITY_SERVICE') private readonly identityClient: ClientProxy,
	) {}

	getHello(): string {
		return 'Hello World!';
	}

	async pingIdentity() {
		const result$ = this.identityClient.send('ping', {});
		return await firstValueFrom(result$);
	}
}
