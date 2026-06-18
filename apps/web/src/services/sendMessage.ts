import { apiClient } from "@/lib";

export default async function sendMessage(payload: {
  conversationId: string;
  content: string;
}) {
  console.log("api sending message");
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  console.log(response.status, response.ok, response);

  return { status: response.status };
}
