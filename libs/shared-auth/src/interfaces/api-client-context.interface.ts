export interface ApiClientContext {
	clientId: string;
	keyHash: string;
	organizationId: string;
}

export interface ApiJwtPayload {
	clientId: string;
	keyHash: string;
	organizationId: string;
}
