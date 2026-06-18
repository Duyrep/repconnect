"use client";

import { Button, Input } from "@/components/ui";
import { ConversationType } from "@/enums";
import { Conversation, Message } from "@/interfaces";
import { getConversation, getMessages } from "@/services";
import { useChatStore, useSocketStore } from "@/store";
import { useUserStore } from "@/store/user";
import { cn, formatRelativeTime } from "@/utils";
import { ArrowLeft, CirclePlus, SendHorizonal, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Chat() {
  const storeUser = useUserStore((state) => state.user);
  const socket = useSocketStore((state) => state.socket);
  const join = useChatStore((state) => state.join);
  const leave = useChatStore((state) => state.leave);
  const storeSendMessage = useChatStore((state) => state.sendMessage);
  const subscribeMessages = useChatStore((state) => state.subscribeMessages);
  const unsubscribeMessages = useChatStore(
    (state) => state.unsubscribeMessages,
  );

  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLElement>(null);

  const { id } = useParams() as { id: string };

  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [scrollSnapshot, setScrollSnapshot] = useState<{
    scrollHeight: number;
    scrollTop: number;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [areMessagesLoading, setAreMessagesLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isHasMoreMessages, setIsHasMoreMessages] = useState(true);
  const [conversation, setConversation] = useState<Conversation | undefined>();

  const sendMessage = async () => {
    if (content.length === 0) return;

    console.log("sending message");
    const status = await storeSendMessage({ conversationId: id, content });

    if (!status || !storeUser) return;

    setContent("");
  };

  const loadMoreMessages = async () => {
    if (areMessagesLoading || !isHasMoreMessages) return;
    setAreMessagesLoading(true);
    const date = messages.at(0)?.createdAt;
    if (!date) return;

    const { messages: newMessages } = await getMessages(id, 50, date);

    if (newMessages.length === 0) {
      setIsHasMoreMessages(false);
      return;
    }

    setMessages((prev) => [...newMessages, ...prev]);
    setAreMessagesLoading(false);

    const chat = chatContainerRef.current;
    if (chat)
      setScrollSnapshot({
        scrollHeight: chat.scrollHeight,
        scrollTop: chat.scrollTop,
      });
  };

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    subscribeMessages(handleNewMessage);

    return () => unsubscribeMessages(handleNewMessage);
  }, [socket]);

  useEffect(() => {
    join(id);
    return () => leave();
  }, [socket]);

  useLayoutEffect(() => {
    const chat = chatContainerRef.current;
    if (scrollSnapshot && chat) {
      const { scrollHeight } = chat;
      chat.scrollTop = scrollHeight - scrollSnapshot.scrollHeight;
      setScrollSnapshot(null);
    }
  }, [messages, scrollSnapshot]);

  useEffect(() => {
    const fetchConversation = async () => {
      const { conversation } = await getConversation(id);
      setConversation(conversation);

      if (conversation.type === ConversationType.INDIVIDUAL) {
        const user = conversation?.participants.filter(
          ({ username }) => storeUser?.username !== username,
        )[0];
        if (user) setName(user.displayName ?? user.username);
      }
    };

    fetchConversation();

    (async () => {
      const { messages, status } = await getMessages(id);

      if (status !== 200) return;

      setMessages(messages);
      setIsFirstLoad(false);
      setAreMessagesLoading(false);
    })();
  }, [storeUser]);

  useEffect(() => {
    if (isFirstLoad) return;
    const chat = chatContainerRef.current;
    if (chat) chat.scrollTop = chat.scrollHeight - chat.clientHeight;
  }, [isFirstLoad]);

  useEffect(() => {
    const chat = chatContainerRef.current;
    if (!chat) return;

    if (chat.scrollHeight - chat.scrollTop - chat.clientHeight <= 200)
      chat.scrollTo({
        top: chat.scrollHeight - chat.clientHeight,
        left: 0,
      });
  }, [messages]);

  return (
    <>
      <nav className="flex flex-col bg-surface-a30 rounded-b-md">
        <div className="flex items-center gap-2 font-bold text-lg p-2">
          <Link href="/chat">
            <ArrowLeft size={32} />
          </Link>
          <div className="flex items-center">
            <div className="p-2 bg-surface-a10 rounded-full">
              <UserRound size={24} />
            </div>
          </div>
          {name}
        </div>
      </nav>
      <main
        ref={chatContainerRef}
        className="flex-1 w-full h-full flex flex-col overflow-auto"
        onScroll={(e) => {
          const chat = e.target as HTMLElement;

          if (chat.scrollTop <= 200) loadMoreMessages();
        }}
      >
        <MessageList messages={messages} />
      </main>
      <div className="flex gap-2 items-center p-2 bg-surface-a10 rounded-t-md">
        <Button className="p-2 text-primary-a0">
          <CirclePlus size={32} />
        </Button>
        <Input
          ref={messageInputRef}
          className="w-full"
          value={content}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button className="px-3 py-2 text-primary-a0" onClick={sendMessage}>
          <SendHorizonal size={32} />
        </Button>
      </div>
    </>
  );
}

function MessageList({ messages }: { messages: Message[] }) {
  const storeUser = useUserStore((state) => state.user);

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map(({ id, content, sender, createdAt }) => (
        <div
          key={id}
          className={cn(
            "flex w-full",
            sender.id === storeUser?.id && "justify-end",
          )}
        >
          <div className="flex gap-2 rounded-md sm:max-w-lg max-sm:max-w-[75%]">
            {sender.id !== storeUser?.id && (
              <div>
                <div className="p-2 bg-surface-a10 rounded-full">
                  <UserRound size={24} />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 bg-surface-a20 p-2 rounded-md min-w-0">
              <b className="truncate">
                {sender.displayName ?? sender.username}
              </b>
              <div className="wrap-break-word">{content}</div>
              <div className="text-xs text-surface-a70">
                {formatRelativeTime(new Date(createdAt))}
              </div>
            </div>
            {sender.id === storeUser?.id && (
              <div>
                <div className="p-2 bg-surface-a10 rounded-full">
                  <UserRound size={24} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
