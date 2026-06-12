import { generateId } from '@/common/utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({
    default: () => generateId(), // TSID
    type: String,
    match: /^[A-Za-z0-9]+$/,
  })
  _id!: string;

  @Prop({
    required: true,
    type: String,
    ref: 'User',
    match: /^[A-Za-z0-9]+$/,
  })
  sender!: string;

  @Prop({
    required: true,
    type: String,
    match: /^[A-Za-z0-9]+$/,
  })
  conversationId!: string;

  @Prop({
    required: true,
    type: String,
  })
  content!: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
