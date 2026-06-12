import { apiClient } from "@/lib";

export default async function createConversation() {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
    { method: "POST" },
  );

  const conversation = await response.json();

  return { conversation, status: response.status };
}
