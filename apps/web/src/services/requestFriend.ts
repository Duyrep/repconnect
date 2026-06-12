import { apiClient } from "@/lib";

export default async function requestFriend(
  requesterId: string,
  recipientId: string,
) {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/friendships/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requesterId, recipientId }),
    },
  );

  return { status: response.status };
}
