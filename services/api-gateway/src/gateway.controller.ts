import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('test')
export class GatewayController {
	constructor(private readonly gatewayService: GatewayService) {}

	@Get()
	getHello(): string {
		return this.gatewayService.getHello();
	}

	@Get('ping')
	async ping() {
		return await this.gatewayService.pingIdentity();
	}
}
