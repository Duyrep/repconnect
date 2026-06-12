import { Conversation } from "@/interfaces/Conversation";
import { apiClient } from "@/lib";

export default async function getIndividualConversation(userId: string) {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations/individual/${userId}`,
  );

  const conversation = (await response.json()) as Conversation;

  return { conversation, status: response.status };
}
