"use client";

import { useSocketStore, useUserStore } from "@/store";
import { useEffect } from "react";

export default function Providers({
  children,
}: {
  children?: React.ReactNode;
}) {
  const fetchUser = useUserStore((status) => status.fetchUser);
  const connect = useSocketStore((status) => status.connect);
  const disconnect = useSocketStore((status) => status.disconnect);
  const socket = useSocketStore((status) => status.socket);

  useEffect(() => {
    fetchUser();

    connect();

    return () => {
      console.log("provider socket disconnect");
      disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("provider socket", socket);
  }, [socket]);

  return children;
}
