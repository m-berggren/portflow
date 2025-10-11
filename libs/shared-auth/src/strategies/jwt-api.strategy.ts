import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
	ApiClientContext,
	ApiJwtPayload,
} from '../interfaces/api-client-context.interface';

// The arg name specifies how guard will connect to this strategy
@Injectable()
export class JwtApiStrategy extends PassportStrategy(Strategy, 'jwt-api') {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_API_PUBLIC_KEY'),
			algorithms: ['RS256'],
		});
	}

	// Transforms verified JWT payload into application context
	async validate(payload: ApiJwtPayload): Promise<ApiClientContext> {
		if (!payload.clientId) {
			throw new UnauthorizedException('Invalid token payload');
		}

		return {
			clientId: payload.clientId,
			keyHash: payload.keyHash,
			organizationId: payload.organizationId,
		};
	}
}
