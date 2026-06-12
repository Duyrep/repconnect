import {
  Controller,
  Post,
  Delete,
  Put,
  UseGuards,
  Body,
  Req,
  Get,
} from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import AccessAuthGuard from '../auth/guards/access.guard';
import { RequestFriendshipDto } from './dto/request-friendship.dto';
import type { Request } from 'express';
import { AccessPayload } from '@/common/interfaces';

@UseGuards(AccessAuthGuard)
@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Get()
  async findAll(@Req() req: Request & { user: AccessPayload }) {
    const friendShips = await this.friendshipsService.getPendingRequests(
      req.user.sub,
    );
    return friendShips;
  }

  @Get('friends')
  async getAllFriends(@Req() req: Request & { user: AccessPayload }) {
    const friendShips = await this.friendshipsService.getFriends(req.user.sub);
    return friendShips;
  }

  @Post('request')
  async request(@Body() requestDto: RequestFriendshipDto) {
    await this.friendshipsService.request(
      requestDto.requesterId,
      requestDto.recipientId,
    );
  }

  @Put('accept')
  async accept(@Body() requestDto: RequestFriendshipDto) {
    await this.friendshipsService.accept(
      requestDto.requesterId,
      requestDto.recipientId,
    );
  }

  @Put('decline')
  async decline(@Body() requestDto: RequestFriendshipDto) {
    await this.friendshipsService.decline(
      requestDto.requesterId,
      requestDto.recipientId,
    );
  }

  @Put('block')
  async block(@Body() requestDto: RequestFriendshipDto) {
    await this.friendshipsService.block(
      requestDto.requesterId,
      requestDto.recipientId,
    );
  }

  @Delete('cancel')
  async cancel(@Body() requestDto: RequestFriendshipDto) {
    await this.friendshipsService.cancel(
      requestDto.requesterId,
      requestDto.recipientId,
    );
  }
}
