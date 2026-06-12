import { AccessPayload } from '@/common/interfaces';
import { EnvironmentVariables } from '@/common/interfaces/env.interface';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export default class AccessStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    const secret = configService.getOrThrow<string>('ACCESS_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.accessToken;
        },
        (req: Request) => req?.cookies?.accessToken,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: secret,
      issuer: configService.get<string>('ISSUER'),
      audience: configService.get<string>('FRONTEND_URL'),
    });
  }

  async validate(payload: AccessPayload, done: VerifiedCallback) {
    if (!payload.sub) throw new UnauthorizedException();
    return done(null, payload);
  }
}
