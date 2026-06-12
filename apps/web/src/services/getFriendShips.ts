import { FriendShip } from "@/interfaces/FriendShip";
import { apiClient } from "@/lib";

export default async function getFriendShips() {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/friendships`,
  );

  const friendShips = (await response.json()) as FriendShip[];

  return { friendShips, status: response.status };
}
