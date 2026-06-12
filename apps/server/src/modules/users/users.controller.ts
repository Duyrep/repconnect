import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FriendshipsService } from '../friendships/friendships.service';
import type { Request } from 'express';
import { AccessPayload } from '@/common/interfaces';
import { FriendShipStatus } from '@/common/enums';
import { AccessAuthGuard } from '../auth/guards';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly friendShipService: FriendshipsService,
  ) {}

  @UseGuards(AccessAuthGuard)
  @Get(':username')
  async findOne(
    @Param('username') username: string,
    @Req() req: Request & { user: AccessPayload },
  ) {
    if (!req.user.sub) throw new UnauthorizedException();

    const user = await this.userService.findOneByUsername(username);
    if (!user) throw new NotFoundException();

    const friendShip = await this.friendShipService.findByBetween(
      req.user!.sub,
      user._id,
    );

    if (friendShip && friendShip.status === FriendShipStatus.BLOCKED)
      throw new NotFoundException();

    return {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      createdAt: user.createdAt,
      friendShipStatus: friendShip ? friendShip.status : FriendShipStatus.NONE,
    };
  }
}
