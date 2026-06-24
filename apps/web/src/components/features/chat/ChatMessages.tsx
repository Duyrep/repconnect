import type { Message } from "@/interfaces";
import {
  useChatStore,
  useMessageStore,
  useSocketStore,
  useUserStore,
} from "@/store";
import { cn, formatRelativeTime } from "@/utils";
import { UserRound } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ChatMessages() {
  const { id: conversationId } = useParams() as { id: string };

  const storeUser = useUserStore((state) => state.user);
  const isConnecting = useSocketStore((state) => state.isConnecting);
  const messages = useMessageStore((state) => state.messages);

  const fetchMessages = useMessageStore((state) => state.fetchMessages);
  const clearMessages = useMessageStore((state) => state.clearMessages);
  const addMessage = useMessageStore((state) => state.addMessage);
  const subscribeMessages = useChatStore((state) => state.subscribeMessages);
  const unsubscribeMessages = useChatStore(
    (state) => state.unsubscribeMessages,
  );

  useEffect(() => {
    const handleMessage = (message: Message) => {
      addMessage(message);
    };

    subscribeMessages(handleMessage);
    return () => unsubscribeMessages(handleMessage);
  }, [isConnecting]);

  useEffect(() => {
    fetchMessages(conversationId);
    return () => clearMessages();
  }, [conversationId]);

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

function Message() {}
