"use client";

import { useConversationStore } from "@/store";
import { ArrowLeft, UserRound } from "lucide-react";
import Link from "next/link";

export default function ChatHeader() {
  const conversationName = useConversationStore((state) =>
    state.getConversationName(),
  );

  return (
    <header className="flex flex-col bg-surface-a30 rounded-b-md">
      <div className="flex items-center gap-2 font-bold text-lg p-2">
        <Link href="/chat">
          <ArrowLeft size={32} />
        </Link>
        <Avatar />
        {conversationName}
      </div>
    </header>
  );
}

function Avatar() {
  return (
    <div className="flex items-center">
      <div className="p-2 bg-surface-a10 rounded-full">
        <UserRound size={24} />
      </div>
    </div>
  );
}
