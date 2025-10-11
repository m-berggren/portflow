import { Injectable, NotFoundException } from '@nestjs/common';
import type { RoleName } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			include: {
				roles: true,
				organization: true,
			},
		});
	}

	async findById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: {
				roles: true,
				organization: true,
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async create(data: {
		email: string;
		username: string;
		password: string;
		firstName: string;
		lastName: string;
		organizationId: number;
		roleNames: RoleName[];
	}) {
		// Hash password
		const passwordHash = await bcrypt.hash(data.password, 10);

		// Create user with roles
		return this.prisma.user.create({
			data: {
				email: data.email,
				username: data.username,
				passwordHash,
				firstName: data.firstName,
				lastName: data.lastName,
				organizationId: data.organizationId,
				roles: {
					connect: data.roleNames.map((name) => ({ name })),
				},
			},
			include: {
				roles: true,
				organization: true,
			},
		});
	}

	async updateLastLogin(userId: number) {
		return this.prisma.user.update({
			where: { id: userId },
			data: { lastLoginAt: new Date() },
		});
	}
}
