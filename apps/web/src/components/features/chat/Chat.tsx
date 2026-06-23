"use client";

import ChatHeader from "./ChatHeader";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useConversationStore } from "@/store";
import Loading from "@/app/(main)/loading";

export default function Chat() {
  const { id: conversationId } = useParams() as { id: string };

  const isConversationLoading = useConversationStore(
    (state) => state.isConversationLoading,
  );

  const fetchConversation = useConversationStore(
    (state) => state.fetchConversation,
  );

  const clearConversation = useConversationStore(
    (state) => state.clearConversation,
  );

  useEffect(() => {
    fetchConversation(conversationId);

    return () => clearConversation();
  }, [conversationId]);

  if (isConversationLoading) return <Loading />;

  return (
    <>
      <ChatHeader />
    </>
  );
}
