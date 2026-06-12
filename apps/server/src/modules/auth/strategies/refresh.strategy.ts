import { RefreshPayload } from '@/common/interfaces';
import { EnvironmentVariables } from '@/common/interfaces/env.interface';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export default class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    const secret = configService.getOrThrow<string>('REFRESH_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refreshToken,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: secret,
      issuer: configService.get<string>('ISSUER'),
      audience: configService.get<string>('FRONTEND_URL'),
    });
  }

  async validate(payload: RefreshPayload, done: VerifiedCallback) {
    if (!payload.sub) throw new UnauthorizedException();

    const user = await this.userService.findOne({ _id: payload.sub });
    const token_version = user?.token_version;

    if (token_version !== payload.tov) throw new UnauthorizedException();

    return done(null, {
      ...payload,
      tov: token_version,
      roles: user?.roles,
    });
  }
}
