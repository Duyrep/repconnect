"use client";

import { Button, Input } from "@/components/ui";
import { useChatStore, useUserStore } from "@/store";
import { CirclePlus, SendHorizonal } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

export default function ChatInput() {
  const { id: conversationId } = useParams() as { id: string };

  const messageInputRef = useRef<HTMLInputElement>(null);

  const storeUser = useUserStore((state) => state.user);
  const storeSendMessage = useChatStore((state) => state.sendMessage);

  const [content, setContent] = useState<string>("");

  const sendMessage = async () => {
    if (content.length === 0) return;

    const status = await storeSendMessage({ conversationId, content });

    if (!status || !storeUser) return;

    setContent("");
  };

  return (
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
  );
}
