import { Module } from '@nestjs/common';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { MqttModule } from './mqtt/mqtt.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		RolesModule,
		PrismaModule,
		MqttModule,
		HealthModule,
		OrganizationsModule,
		ApiKeysModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
