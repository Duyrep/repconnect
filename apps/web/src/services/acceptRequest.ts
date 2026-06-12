import { apiClient } from "@/lib";

export default async function acceptRequest(
  requesterId: string,
  recipientId: string,
) {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/friendShips/accept`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requesterId, recipientId }),
    },
  );

  return { status: response.status };
}
