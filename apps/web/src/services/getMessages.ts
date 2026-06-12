import { Message } from "@/interfaces";
import { apiClient } from "@/lib";

export default async function getMessages(
  conversationId: string,
  limit: number = 50,
  date?: string,
) {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/messages/${conversationId}`,
  );
  url.searchParams.append("limit", limit + "");
  url.searchParams.append("date", date ?? "");

  const response = await apiClient(url);

  const messages = (await response.json()) as Message[];

  messages.reverse();

  return { messages, status: response.status };
}
