"use client";

import { Button } from "@/components/ui";
import { useUserStore } from "@/store/user";
import { CircleUserRound } from "lucide-react";
import { useEffect } from "react";
import Loading from "../loading";
import BotNavBar from "@/components/layout/BotNavBar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Me() {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const isLoading = useUserStore((state) => state.isLoading);
  const displayName = useUserStore((state) => state.getDisplayname());
  const username = useUserStore((state) => state.getUsername());

  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="h-full flex flex-col gap-10 justify-center items-center">
        <div className="flex flex-col gap-4 justify-center items-center bg-surface-a10 rounded-md p-16">
          <CircleUserRound size={96} strokeWidth={1} />
          <div className="flex flex-col items-center">
            <b className="text-2xl">{displayName}</b>
            <p>@{username}</p>
          </div>
        </div>
        <Button
          onClick={async () => {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
              method: "POST",
              credentials: "include",
            });
            router.push("/login");
          }}
          className="px-4 py-2 rounded-md bg-surface-a30 hover:bg-surface-a20"
        >
          Logout
        </Button>
      </div>
      <BotNavBar />
    </>
  );
}
