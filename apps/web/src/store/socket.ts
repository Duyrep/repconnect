import { create } from "zustand";
import { io, Socket } from "socket.io-client";

export interface SocketState {
  socket?: Socket;
  isConnected: boolean;
  isConnecting: boolean;
  error?: Object;
  disconnectReason?: string;

  connect: () => void;
  disconnect: () => void;
  isSocketReady: () => boolean;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: undefined,
  isConnected: false,
  isConnecting: false,
  error: undefined,
  disconnectReason: undefined,

  connect: () => {
    const { socket, isConnected, isConnecting } = get();

    console.log(
      "connect.socket",
      socket,
      "connect.isConnected",
      isConnected,
      "connect.isConnecting",
      isConnecting,
    );

    if (socket || isConnected || isConnecting) return;

    set({ isConnecting: true });

    const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      withCredentials: true,
      transports: ["polling", "websocket"],
    });

    console.log("socket connecting");

    newSocket.on("connect", async () => {
      console.log("socket connected");
      set({
        socket: newSocket,
        isConnected: true,
        isConnecting: false,
        error: undefined,
      });
    });

    newSocket.on("connect_error", (error) => {
      console.error(error);
      set({ isConnected: false, isConnecting: false, error });
    });

    newSocket.on("disconnect", (reason) => {
      console.log("disconnect reason", reason);
      set({
        socket: undefined,
        isConnected: false,
        error: undefined,
        disconnectReason: reason,
      });
    });

    newSocket.on("exception", (error) => {
      console.error(error);
    });
  },

  disconnect: () => {
    const { socket, isConnected, isConnecting } = get();

    if (!isConnected || isConnecting || !socket) return;

    socket.disconnect();
  },

  isSocketReady: () => {
    const { socket, isConnected, isConnecting } = get();

    if (!socket || !isConnected || isConnecting) return false;

    return true;
  },
}));
