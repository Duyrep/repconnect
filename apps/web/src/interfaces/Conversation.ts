import { ConversationType } from "@rep/shared/enums";

export default interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  participants: { id: string; username: string; displayName: string }[];
  createdAt: Date;
  updatedAt: Date;
}
