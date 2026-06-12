import { FriendShipStatus } from '@/common/enums';
import { generateId } from '@/common/utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'friendships' })
export class FriendShip {
  @Prop({
    default: () => generateId(), // TSID
    type: String,
    match: /^[A-Za-z0-9]+$/,
  })
  _id!: string;

  @Prop({
    index: true,
    required: true,
    default: () => generateId(), // TSID
    type: String,
    ref: 'User',
    match: /^[A-Za-z0-9]+$/,
  })
  requesterId!: string;

  @Prop({
    index: true,
    required: true,
    default: () => generateId(), // TSID
    type: String,
    ref: 'User',
    match: /^[A-Za-z0-9]+$/,
  })
  recipientId!: string;

  @Prop({
    required: true,
    default: FriendShipStatus.PENDING,
    type: String,
    enum: FriendShipStatus,
  })
  status!: FriendShipStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export type FriendShipDocument = HydratedDocument<FriendShip>;
export const FriendShipSchema = SchemaFactory.createForClass(FriendShip);
