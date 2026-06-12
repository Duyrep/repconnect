import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class ChatService {
  constructor(private readonly messageService: MessagesService) {}

  public async saveMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ) {
    return await this.messageService.create(senderId, {
      conversationId,
      content,
    });
  }
}
