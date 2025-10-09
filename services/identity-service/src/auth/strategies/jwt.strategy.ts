import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload, UserContext } from '@portflow/shared-auth';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
		});
	}

	// Transforms verified JWT payload into application context
	async validate(payload: JwtPayload): Promise<UserContext> {
		if (!payload.sub) {
			throw new UnauthorizedException('Invalid token payload');
		}

		return {
			userId: payload.sub,
			email: payload.email,
			organizationId: payload.organizationId,
			roles: payload.roles || [],
		};
	}
}
