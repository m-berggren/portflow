import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [ConfigModule, PassportModule.register({ defaultStrategy: 'jwt' })],
	providers: [],
	exports: [PassportModule],
})
export class SharedAuthModule {}
