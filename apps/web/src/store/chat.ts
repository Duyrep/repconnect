import { create } from "zustand";
import { useSocketStore, type SocketState } from "./socket";
import { sendMessage } from "@/services";
import { Message } from "@/interfaces";
import { ChatEvent } from "@rep/shared/events";

export interface MessagePayload {
  conversationId: string;
  content: string;
}

export interface ChatState {
  join: (id: string) => void;
  sendMessage: (payload: MessagePayload) => Promise<boolean>;
  subscribeMessages: (listener: (message: Message) => void) => void;
  unsubscribeMessages: (listener: (message: Message) => void) => void;
}

export const useChatStore = create<ChatState>((get, set) => ({
  join: (id: string) => {
    const { socket, isConnected, isConnecting } = useSocketStore.getState();

    if (!socket || !isConnected || isConnecting) return;

    socket.emit(ChatEvent.ConversationJoin, id);
  },

  sendMessage: async (payload: MessagePayload) => {
    const { socket, isSocketReady } = useSocketStore.getState();

    if (!socket || !isSocketReady()) return false;

    const { status } = await sendMessage(payload);

    if (status !== 201) return false;

    return true;
  },

  subscribeMessages: (listener: (message: Message) => void) => {
    const { socket, isSocketReady } = useSocketStore.getState();

    if (!socket || !isSocketReady()) return false;

    socket.on(ChatEvent.MessageNew, listener);
  },

  unsubscribeMessages: (listener: (message: Message) => void) => {
    const { socket, isSocketReady } = useSocketStore.getState();

    if (!socket || !isSocketReady()) return false;

    socket.off(ChatEvent.MessageNew, listener);
  },
}));
