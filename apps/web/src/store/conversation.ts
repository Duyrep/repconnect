import { create } from "zustand";
import { getConversation } from "@/services";
import { Conversation } from "@/interfaces";
import { ConversationType } from "@rep/shared/enums";
import { useUserStore } from "./user";

export interface ConversationState {
  isConversationLoading: boolean;
  conversation?: Conversation;

  fetchConversation: (conversationId: string) => Promise<void>;
  clearConversation: () => void;
  getConversationName: () => string;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  isConversationLoading: true,
  conversation: undefined,

  fetchConversation: async (conversationId: string) => {
    const { conversation, status } = await getConversation(conversationId);

    if (status !== 200) return;

    set({ conversation, isConversationLoading: false });
  },

  clearConversation: () => {
    set({ conversation: undefined, isConversationLoading: true });
  },

  getConversationName: () => {
    const currentUserId = useUserStore.getState().getId();
    const conversation = get().conversation;

    if (!conversation) return "unknown";

    if (conversation.name) return conversation.name;

    if (conversation.type === ConversationType.INDIVIDUAL) {
      const user = conversation?.participants.filter(
        ({ id }) => currentUserId === id,
      )[0];
      if (user) return user.displayName ?? user.username;
    }

    return "unknown";
  },
}));
