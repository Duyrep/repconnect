import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AccessAuthGuard } from '../auth/guards';
import type { Request } from 'express';
import { AccessPayload } from '@/common/interfaces';

@UseGuards(AccessAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: Request & { user: AccessPayload },
  ) {
    await this.messagesService.create(req.user.sub, createMessageDto);
  }

  @Get(':conversationId')
  async findByConversationId(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit: number,
    @Query('date') date: string,
  ) {
    return this.messagesService.findByConversationId(
      conversationId,
      limit,
      date,
    );
  }
}
