import { FriendShipStatus } from "@/enums";

export interface User {
  id: string;
  email?: string;
  username: string;
  displayName: string;
  createdAt?: string;
  friendShipStatus?: FriendShipStatus;
  conversationId?: string;
}
