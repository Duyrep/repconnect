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

  useEffect(() => {
    fetchUser();

    connect();

    return () => disconnect();
  }, []);

  return children;
}
