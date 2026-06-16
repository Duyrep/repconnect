import { ConversationType } from '@/common/enums';
import { generateId } from '@/common/utils';
import { FriendShip } from '@/modules/friendships/schemas/friendship.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'conversations' })
export class Conversation<T extends ConversationType = ConversationType> {
  @Prop({
    default: () => generateId(), // TSID
    type: String,
    match: /^[A-Za-z0-9]+$/,
  })
  _id!: string;

  @Prop({
    required: true,
    default: ConversationType.INDIVIDUAL,
    type: String,
    enum: ConversationType,
  })
  type!: T;

  @Prop({ type: String })
  name?: string;

  @Prop({
    required: true,
    validate: {
      validator: (value: string[]) => value && value.length >= 2,
    },
    type: [
      { type: String, ref: 'User', match: /^[A-Za-z0-9]+$/, unique: true },
    ],
  })
  participants!: string[];

  @Prop({ type: String, ref: 'FriendShip' })
  friendship?: T extends ConversationType.INDIVIDUAL ? string : never;

  createdAt?: Date;
  updatedAt?: Date;
}

export type ConversationDocument = HydratedDocument<Conversation>;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
