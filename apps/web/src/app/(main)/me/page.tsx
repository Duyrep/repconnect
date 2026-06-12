"use client";

import { Button } from "@/components/ui";
import { useUserStore } from "@/store/user";
import { CircleUserRound } from "lucide-react";
import { useEffect } from "react";
import Loading from "../loading";
import BotNavBar from "@/components/layout/BotNavBar";

export default function Me() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const isLoading = useUserStore((state) => state.isLoading);
  const displayName = useUserStore((state) => state.getDisplayname());
  const username = useUserStore((state) => state.getUsername());

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col gap-4 justify-center items-center bg-surface-a10 rounded-md p-16">
          <CircleUserRound size={96} strokeWidth={1} />
          <div className="flex flex-col items-center">
            <b className="text-2xl">{displayName}</b>
            <p>@{username}</p>
          </div>
        </div>
      </div>
      <BotNavBar />
    </>
  );
}
