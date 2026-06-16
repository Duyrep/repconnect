import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema';
import { FriendshipsModule } from '../friendships/friendships.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    FriendshipsModule,
  ],
  controllers: [ConversationsController],
  providers: [MongooseModule, ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
