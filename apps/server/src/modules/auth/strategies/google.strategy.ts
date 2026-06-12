import { EnvironmentVariables } from '@/common/interfaces/env.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export default class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    const client_id = configService.get<string>('GOOGLE_CLIENT_ID');
    const client_secret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('API_URL');

    if (!client_id || !client_secret) {
      throw new InternalServerErrorException();
    }

    super({
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: `${callbackURL}/auth/google/callback`,
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { id: string; emails: { value: string }[] },
    done: VerifyCallback,
  ) {
    const { id, emails } = profile;
    const user = {
      provider: 'google',
      client_id: id,
      email: emails[0].value,
      username: emails[0].value.split('@')[0],
    };

    return done(null, user);
  }
}
