import { create } from "zustand";
import { useSocketStore } from "./socket";
import { sendMessage } from "@/services";
import { Message } from "@/interfaces";
import { AppEvents } from "@rep/shared/events";

export interface MessagePayload {
  conversationId: string;
  content: string;
}

export interface ChatState {
  join: (id: string) => void;
  leave: () => void;
  sendMessage: (payload: MessagePayload) => Promise<boolean>;
  subscribeMessages: (listener: (message: Message) => void) => void;
  unsubscribeMessages: (listener: (message: Message) => void) => void;
}

export const useChatStore = create<ChatState>((get, set) => ({
  join: (id: string) => {
    const { socket, isSocketReady } = useSocketStore.getState();

    if (!socket || !isSocketReady()) return;

    socket.emit(AppEvents.ConversationJoin, id);
  },

  leave: () => {
    const { socket, isSocketReady } = useSocketStore.getState();

    if (!socket || !isSocketReady()) return;

    socket.emit(AppEvents.ConversationLeave);
  },

  sendMessage: async (payload: MessagePayload) => {
    const { socket, isSocketReady } = useSocketStore.getState();

    console.log("store socket", socket, "is socket ready", isSocketReady());
    if (!socket || !isSocketReady()) return false;

    console.log("store sending message");

    const { status } = await sendMessage(payload);

    if (status !== 201) return false;

    return true;
  },

  subscribeMessages: (listener: (message: Message) => void) => {
    const { socket, isSocketReady } = useSocketStore.getState();

    if (!socket || !isSocketReady()) return false;

    socket.on(AppEvents.MessageNew, listener);
  },

  unsubscribeMessages: (listener: (message: Message) => void) => {
    const { socket, isSocketReady } = useSocketStore.getState();

    if (!socket || !isSocketReady()) return false;

    socket.off(AppEvents.MessageNew, listener);
  },
}));
