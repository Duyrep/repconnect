import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import GoogleStrategy from './strategies/google.strategy';
import { UsersModule } from '../users/users.module';
import AccessStrategy from './strategies/access.strategy';
import RefreshStrategy from './strategies/refresh.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, AccessStrategy, RefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
