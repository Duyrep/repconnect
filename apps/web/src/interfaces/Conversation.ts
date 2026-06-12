import { ConversationType } from "@/enums";

export interface Conversation {
  id: string;
  participants: { _id: string; username: string; displayName: string }[];
  type: ConversationType;
  createdAt: string;
  updatedAt: string;
}
