export enum UserRole {
	ADMIN = 'ADMIN',
	OPERATOR = 'OPERATOR',
	CUSTOMER = 'CUSTOMER',
}

export interface UserContext {
	userId: string;
	email: string;
	organizationId: string;
	roles: UserRole[];
}

export interface JwtPayload {
	sub: string;
	email: string;
	organizationId: string;
	roles: UserRole[];
}
