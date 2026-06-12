import { apiClient } from "@/lib";

export default async function declineRequest(
  requesterId: string,
  recipientId: string,
) {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/friendShips/decline`,
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
