import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, UserContext } from '../interfaces/user-context.interface';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_PUBLIC_KEY'),
			algorithms: ['RS256'],
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
