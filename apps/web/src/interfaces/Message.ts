export interface Message {
  id: string;
  sender: { id: string; username: string; displayName: string };
  content: string;
  createdAt: string;
}
