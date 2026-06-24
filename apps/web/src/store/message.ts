import { Message } from "@/interfaces";
import { getMessages } from "@/services";
import { create } from "zustand";
import { useConversationStore } from "./conversation";

export interface MessageState {
  areMessagesLoading: boolean;
  hasMoreMessages: boolean;
  messages: Message[];

  fetchMessages: (conversationId: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  loadMoreMessages: (conversationId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  areMessagesLoading: true,
  hasMoreMessages: true,
  messages: [],

  fetchMessages: async (conversationId: string) => {
    const { messages, status } = await getMessages(conversationId);

    if (status !== 200) return;

    set({ messages, areMessagesLoading: false });
  },

  addMessage: (message: Message) =>
    set({ messages: [...get().messages, message] }),

  loadMoreMessages: async (conversationId: string) => {
    const { messages, areMessagesLoading, hasMoreMessages } = get();

    if (areMessagesLoading || !hasMoreMessages) return;

    set({ areMessagesLoading: true });
    const date = messages.at(0)?.createdAt;

    if (!date) return;

    const { messages: newMessages } = await getMessages(
      conversationId,
      50,
      date,
    );

    if (newMessages.length === 0) {
      set({ hasMoreMessages: false });
      return;
    }

    set({ messages: [...newMessages, ...messages] });
    set({ areMessagesLoading: false });

    // const chat = chatContainerRef.current;
    // if (chat)
    //   setScrollSnapshot({
    //     scrollHeight: chat.scrollHeight,
    //     scrollTop: chat.scrollTop,
    //   });
  },

  clearMessages: () => set({ messages: [] }),
}));
