import { AuthGuard } from '@nestjs/passport';

export default class GoogleAuthGuard extends AuthGuard('google') {}
