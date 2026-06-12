import { Conversation } from "@/interfaces";
import { apiClient } from "@/lib";

export default async function getConversation(id: string) {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations/${id}`,
  );

  const conversation = (await response.json()) as Conversation;

  return { conversation, status: response.status };
}
