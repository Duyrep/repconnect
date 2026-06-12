import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import GoogleAuthGuard from './guards/google.guard';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/common/interfaces/env.interface';
import type { Request, Response } from 'express';
import AccessAuthGuard from './guards/access.guard';
import { UserRole } from '@/common/enums';
import { AccessPayload, RefreshPayload } from '@/common/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { Model } from 'mongoose';
import { generateId } from '@/common/utils';
import RefreshAuthGuard from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly configSerVice: ConfigService<EnvironmentVariables>,
  ) {}

  @Get('me')
  @UseGuards(AccessAuthGuard)
  async me(@Req() req: Request & { user: AccessPayload }) {
    if (!req.user.sub) throw new UnauthorizedException();
    const user = await this.userService.findOne({ _id: req.user.sub });

    return {
      id: user?._id,
      email: user?.email,
      username: user?.username,
      displayName: user?.displayName,
      roles: user?.roles,
      createAt: user?.createdAt,
    };
  }

  @Get('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request & { user: RefreshPayload },
  ) {
    const { sub, tov, roles } = req.user;

    if (!roles) throw new UnauthorizedException();

    await this.authService.issueAccessToken(res, {
      sub,
      tov,
      roles,
    });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  async googleAuthRedirect(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request & { user: { client_id: string } },
  ) {
    let sub = generateId(),
      tov = 0,
      roles = [UserRole.USER];
    const { client_id } = req.user;

    const exists = await this.userService.exists({ client_id });

    if (exists) {
      const user = await this.userService.findOne({ client_id });
      ((sub = user!._id), (tov = user!.token_version), (roles = user!.roles));
    } else {
      const user = await this.userModel.create(req.user);

      sub = user._id;
    }

    await this.authService.issueAccessToken(res, { sub, tov, roles });
    await this.authService.issueRefreshToken(res, { sub, tov });

    return {
      url: `${this.configSerVice.get<string>('FRONTEND_URL')}`,
      statusCode: 302,
    };
  }

  @Post('logout')
  @UseGuards(AccessAuthGuard)
  async logout(@Req() req: Request & { user: RefreshPayload }) {
    if (!req.user.sub) throw new BadRequestException();
    await this.authService.logout(req.user.sub);
  }
}
