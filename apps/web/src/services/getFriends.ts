import { User } from "@/interfaces";
import { apiClient } from "@/lib";

export default async function getFriends() {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/friendShips/friends`,
  );

  const friends = (await response.json()) as User[];

  return { friends, status: response.status };
}
