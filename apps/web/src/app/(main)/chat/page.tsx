"use client";

import BotNavBar from "@/components/layout/BotNavBar";
import { Conversation } from "@/interfaces";
import { getConversations } from "@/services";
import { useSocketStore, useUserStore } from "@/store";
import { MessageCirclePlus, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Connecting from "../connecting";
import Loading from "../loading";

export default function Chat() {
  const isLoading = useUserStore((state) => state.isLoading);
  const isConnecting = useSocketStore((state) => state.isConnecting);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    (async () => {
      const { conversations, status } = await getConversations();

      if (status !== 200) return;

      setConversations(conversations);
    })();
  }, []);

  if (isLoading) return <Loading />;
  if (isConnecting) return <Connecting />;

  return (
    <>
      <nav className="px-4 py-2 text-2xl">
        <b>RepConnect</b>
      </nav>
      <main className="relative w-full h-full p-4">
        <Link
          href="/directory"
          className="absolute right-0 bottom-0 m-4 bg-primary-a0 p-3 rounded-md"
        >
          <MessageCirclePlus />
        </Link>
        <div></div>
        <div>
          {conversations.map(({ id, participants }) => (
            <Link key={id} href={`/chat/${id}`}>
              <div className="flex justify-between items-center rounded-md p-2 bg-surface-a20">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-2 bg-surface-a0">
                    <UserRound size={32} />
                  </div>
                  <div>
                    <b>
                      {participants.at(0)?.displayName ??
                        `@${participants.at(0)?.username}`}
                    </b>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <BotNavBar />
    </>
  );
}
