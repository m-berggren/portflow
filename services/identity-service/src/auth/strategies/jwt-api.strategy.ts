import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ApiClientContext, ApiJwtPayload } from '@portflow/shared-auth';
import { ExtractJwt, Strategy } from 'passport-jwt';

// The arg name specifies how guard will connect to this strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-api') {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_API_SECRET'),
			signOptions: {
				// Overrides what is specified in AuthModule
				expiresIn: configService.getOrThrow<string>('JWT_API_EXPIRES_IN'),
			},
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
