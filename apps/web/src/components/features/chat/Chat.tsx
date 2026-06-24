"use client";

import ChatHeader from "./ChatHeader";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  useChatStore,
  useConversationStore,
  useMessageStore,
  useSocketStore,
} from "@/store";
import Loading from "@/app/(main)/loading";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function Chat() {
  const { id: conversationId } = useParams() as { id: string };

  const chatContainerRef = useRef<HTMLElement>(null);

  const messages = useMessageStore((state) => state.messages);
  const socket = useSocketStore((state) => state.socket);
  const areMessagesLoading = useMessageStore(
    (state) => state.areMessagesLoading,
  );
  const hasMoreMessages = useMessageStore((state) => state.hasMoreMessages);
  const isConversationLoading = useConversationStore(
    (state) => state.isConversationLoading,
  );

  const joinChat = useChatStore((state) => state.join);
  const leaveChat = useChatStore((state) => state.leave);
  const loadMoreMessages = useMessageStore((state) => state.loadMoreMessages);
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

  useEffect(() => {
    joinChat(conversationId);
    return () => leaveChat();
  }, [socket, conversationId]);

  useEffect(() => {
    const chat = chatContainerRef.current;
    if (!chat) return;

    if (chat.scrollHeight - chat.scrollTop - chat.clientHeight <= 200)
      chat.scrollTo({
        top: chat.scrollHeight - chat.clientHeight,
        left: 0,
      });
  }, [messages]);

  useEffect(() => {
    if (areMessagesLoading) return;
    const chat = chatContainerRef.current;
    if (chat) chat.scrollTop = chat.scrollHeight - chat.clientHeight;
  }, [areMessagesLoading]);

  if (isConversationLoading) return <Loading />;

  return (
    <>
      <ChatHeader />
      <main
        ref={chatContainerRef}
        className="flex-1 w-full h-full flex flex-col overflow-auto"
        onScroll={async (e) => {
          const chat = e.target as HTMLElement;

          if (!hasMoreMessages) return;

          if (chat.scrollTop <= 200) {
            const previousScrollHeight = chat.scrollHeight;

            await loadMoreMessages(conversationId);

            chat.scrollTop = chat.scrollHeight - previousScrollHeight;
          }
        }}
      >
        <ChatMessages />
      </main>
      <ChatInput />
    </>
  );
}
