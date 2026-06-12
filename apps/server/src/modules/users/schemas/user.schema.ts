import { UserRole } from '@/common/enums';
import { generateId } from '@/common/utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({
    default: () => generateId(), // TSID
    type: String,
    match: /^[A-Za-z0-9]+$/,
  })
  _id!: string;

  @Prop({
    required: true,
    type: String,
  })
  client_id!: string;

  @Prop({ required: true, type: String })
  provider!: string;

  @Prop({
    unique: true,
    trim: true,
    lowercase: true,
    type: String,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  })
  email?: string;

  @Prop({
    index: true,
    required: true,
    unique: true,
    type: String,
    match: /^[a-z0-9]+$/,
  })
  username!: string;

  @Prop({ type: String })
  displayName?: string;

  @Prop({
    type: String,
    match:
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,6})+[\/\w\-.?=&]*\/?$/,
  })
  avatarUrl?: string;

  @Prop({
    required: true,
    type: [{ type: String, enum: UserRole }],
    default: [UserRole.USER],
  })
  roles!: UserRole[];

  @Prop({ required: true, type: Number, default: 0 })
  token_version!: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
