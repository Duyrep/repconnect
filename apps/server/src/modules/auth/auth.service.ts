import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/common/interfaces/env.interface';
import { Response } from 'express';
import { AccessPayload, RefreshPayload } from '@/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly userService: UsersService,
  ) {}

  async logout(res: Response, id: string) {
    await this.userService.incrementTokenVersion(id);
    res.clearCookie('accessToken');
  }

  async issueAccessToken(res: Response, payload: AccessPayload) {
    const accessToken = await this.signAccessToken(payload);

    res.cookie('accessToken', accessToken, {
      maxAge: 15 * 60 * 1000, // 15m
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : false,
      path: '/',
    });
  }

  async issueRefreshToken(res: Response, payload: RefreshPayload) {
    const refreshToken = await this.signRefreshToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : false,
      path: '/',
    });
  }

  async signAccessToken(payload: AccessPayload) {
    const secret = this.configService.getOrThrow<string>('ACCESS_SECRET');
    const issuer = this.configService.get<string>('ISSUER');
    const audience = this.configService.get<string>('FRONTEND_URL');

    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '15m',
      issuer,
      audience,
    });
  }

  async signRefreshToken(payload: RefreshPayload) {
    const secret = this.configService.getOrThrow<string>('REFRESH_SECRET');
    const issuer = this.configService.get<string>('ISSUER');
    const audience = this.configService.get<string>('FRONTEND_URL');

    return await this.jwtService.signAsync(payload, {
      secret,
      issuer,
      audience,
    });
  }

  async verifyAccessToken(token: string) {
    const secret = this.configService.getOrThrow<string>('ACCESS_SECRET');
    const issuer = this.configService.get<string>('ISSUER');
    const audience = this.configService.get<string>('FRONTEND_URL');

    return await this.jwtService.verifyAsync<AccessPayload>(token, {
      secret,
      issuer,
      audience,
    });
  }
}
