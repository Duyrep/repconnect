import { Conversation } from "@/interfaces";
import { apiClient } from "@/lib";

export default async function getConversations() {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
  );

  const conversations = (await response.json()) as Conversation[];

  return { conversations, status: response.status };
}
