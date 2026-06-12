import { apiClient } from "@/lib";
import { create } from "zustand";
import { User } from "@/interfaces";

export interface UserState {
  user?: User;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  getId: () => string | undefined;
  getUsername: () => string | undefined;
  getDisplayname: () => string | undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: undefined,
  isLoading: true,

  fetchUser: async () => {
    try {
      const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      );

      const result = (await response.json()) as User;

      if (response.ok) set({ user: result });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },

  getId: () => get().user?.id,
  getUsername: () => get().user?.username,
  getDisplayname: () => get().user?.displayName,
}));
