import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { ConversationsService } from '../conversations/conversations.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageCreatedEvent, MessageEvent } from '@/common/events';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/common/interfaces';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly conversationService: ConversationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, createMessageDto: CreateMessageDto) {
    const conversation = await this.conversationService.getConversationForUser(
      userId,
      createMessageDto.conversationId,
    );

    const content = CryptoJS.AES.encrypt(
      createMessageDto.content,
      this.configService.getOrThrow('MESSAGE_SECRET'),
    ).toString();

    const newMessage = await this.messageModel.create({
      sender: userId,
      conversationId: conversation._id,
      content,
    });

    await newMessage.populate({
      path: 'sender',
      select: '_id username displayName',
    });

    const message = newMessage.toJSON() as unknown as {
      _id: string;
      sender: { _id: string; username: string; displayName?: string };
      conversationId: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    };

    this.eventEmitter.emit(
      MessageEvent.Created,
      new MessageCreatedEvent(
        message._id,
        message.conversationId,
        {
          id: message.sender._id,
          username: message.sender.username,
          displayName: message.sender.displayName,
        },
        createMessageDto.content,
        message.createdAt,
        message.updatedAt,
      ),
    );

    return message;
  }

  async findByConversationId(id: string, limit: number = 50, date?: string) {
    if (!(await this.conversationService.exist(id)))
      throw new NotFoundException();

    const queryDate = date ? new Date(date) : new Date();
    if (isNaN(queryDate.getTime())) {
      throw new BadRequestException();
    }

    const messages = await this.messageModel
      .find({
        conversationId: id,
        createdAt: { $lt: queryDate },
      })
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({ path: 'sender', select: '_id username displayName' })
      .lean<
        {
          _id: string;
          sender: { _id: string; username: string; displayName?: string };
          conversationId: string;
          content: string;
          createdAt: Date;
          updatedAt: Date;
        }[]
      >()
      .exec();

    return messages.map(
      ({ _id, sender, conversationId, content, createdAt, updatedAt }) => ({
        id: _id,
        sender: {
          id: sender._id,
          username: sender.username,
          displayName: sender.displayName,
        },
        conversationId,
        content: CryptoJS.AES.decrypt(
          content,
          this.configService.getOrThrow('MESSAGE_SECRET'),
        ).toString(CryptoJS.enc.Utf8),
        createdAt,
        updatedAt,
      }),
    );
  }
}
