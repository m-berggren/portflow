import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { UserRole } from '../interfaces/user-context.interface';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		/* Checks if user has the required role(s)
		Uses reflector to read metadata from @Roles() decorator
		Compares user's roles with required roles */

		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			'roles',
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user || !user.roles) {
			return false;
		}

		return requiredRoles.some((role) => user.roles.includes(role));
	}
}
