import { MessageStatus } from "@rep/shared/enums";

export interface Message {
  id: string;
  sender: { id: string; username: string; displayName: string };
  status: MessageStatus;
  content: string;
  createdAt: string;
}
