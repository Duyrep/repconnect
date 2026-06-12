import { User } from "@/interfaces";
import { apiClient } from "@/lib";

export default async function getUserByUsername(username: string) {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${username}`,
  );

  return { user: await response.json(), status: response.status } as {
    user: User;
    status: number;
  };
}
