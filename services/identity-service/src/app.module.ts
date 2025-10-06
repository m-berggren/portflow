import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PrismaModule } from './prisma/prisma.module';
import { MqttModule } from './mqtt/mqtt.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, PrismaModule, MqttModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
