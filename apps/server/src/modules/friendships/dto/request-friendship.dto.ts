import { IsNotEmpty, Matches } from 'class-validator';

export class RequestFriendshipDto {
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/)
  requesterId!: string;

  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/)
  recipientId!: string;
}
