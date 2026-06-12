import { AuthGuard } from '@nestjs/passport';

export default class AccessAuthGuard extends AuthGuard('access-token') {}
