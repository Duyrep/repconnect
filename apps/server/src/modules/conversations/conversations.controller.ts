import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { AccessAuthGuard } from '../auth/guards';
import type { Request } from 'express';
import { AccessPayload } from '@/common/interfaces';

@UseGuards(AccessAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async create(@Body() createConversationDto: CreateConversationDto) {
    return await this.conversationsService.create(createConversationDto);
  }

  @Get()
  async findByUserId(@Req() req: Request & { user: AccessPayload }) {
    return await this.conversationsService.findByUserId(req.user.sub);
  }

  @Get('individual/:userId')
  async findIndividual(
    @Req() req: Request & { user: AccessPayload },
    @Param('userId') targetUserId: string,
  ) {
    const conversation = await this.conversationsService.findIndividual(
      req.user.sub,
      targetUserId,
    );

    return {
      id: conversation.id,
      participants: conversation.participants,
      type: conversation.type,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: AccessPayload },
  ) {
    const conversation = await this.conversationsService.findOne(id);

    if (!conversation.participants.some((v) => v._id === req.user.sub))
      throw new ForbiddenException();

    return {
      id: conversation._id,
      participants: conversation.participants,
      type: conversation.type,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationsService.update(id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationsService.remove(id);
  }
}
