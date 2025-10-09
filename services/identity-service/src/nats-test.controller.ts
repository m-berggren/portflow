import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class NatsTestController {
	@MessagePattern('ping')
	handlePing() {
		return 'pong';
	}
}
