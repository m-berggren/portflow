import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, UserContext, UserRole } from '@portflow/shared-auth';
import type { RoleName } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	async login(email: string, password: string) {
		// Find user with roles
		const user = await this.userService.findByEmail(email);

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check if user is active
		if (!user.isActive) {
			throw new UnauthorizedException('Account is disabled');
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Update last login
		await this.userService.updateLastLogin(user.id);

		// Map prisma RoleName to shared-auth UserRole
		const userRoles = this.mapRolesToUserRoles(user.roles);

		// Map user to right context
		const userContext = this.mapUserToUserContext(user, userRoles);

		// Generate token
		const accessToken = this.generateToken(userContext);

		// Return token and user info
		return {
			accessToken,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				organizationId: user.organizationId,
				organizationName: user.organization.name,
				roles: userRoles,
			},
		};
	}

	async register(data: {
		email: string;
		username: string;
		password: string;
		firstName: string;
		lastName: string;
		organizationId: number;
	}) {
		// Create user with CUSTOMER role by default
		const user = await this.userService.create({
			...data,
			roleNames: ['CUSTOMER'],
		});

		// Map prisma RoleName to shared-auth UserRole
		const userRoles = this.mapRolesToUserRoles(user.roles);

		// Map user to the right context
		const userContext = this.mapUserToUserContext(user, userRoles);

		// Generate token
		const accessToken = this.generateToken(userContext);

		return {
			accessToken,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				organizationId: user.organizationId,
				organizationName: user.organization.name,
				roles: userRoles,
			},
		};
	}

	generateToken(userContext: UserContext) {
		// Create JWT payload, secret and expiry is set in module
		const payload: JwtPayload = {
			sub: userContext.userId,
			email: userContext.email,
			organizationId: userContext.organizationId,
			roles: userContext.roles,
		};

		return this.jwtService.sign(payload);
	}

	// Map Prisma RoleName to shared-auth UserRole
	mapRolesToUserRoles(roles: { name: RoleName }[]): UserRole[] {
		const roleMap: Record<RoleName, UserRole> = {
			ADMIN: UserRole.ADMIN,
			OPERATOR: UserRole.OPERATOR,
			CUSTOMER: UserRole.CUSTOMER,
		};

		return roles.map((role) => roleMap[role.name]);
	}

	mapUserToUserContext(
		user: NonNullable<Awaited<ReturnType<typeof this.userService.findByEmail>>>,
		roles: UserRole[],
	): UserContext {
		return {
			userId: user.id.toString(),
			email: user.email,
			organizationId: user.organizationId.toString(),
			roles: roles,
		};
	}

	async validateUser(userId: string) {
		const user = await this.userService.findById(parseInt(userId, 10));

		if (!user.isActive) {
			throw new UnauthorizedException('User is not active');
		}
	}
}
