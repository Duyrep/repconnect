import { AuthGuard } from '@nestjs/passport';

export default class RefreshAuthGuard extends AuthGuard('refresh-token') {}
