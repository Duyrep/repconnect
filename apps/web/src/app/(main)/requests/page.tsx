"use client";

import { FriendShip } from "@/interfaces";
import getFriendShips from "@/services/getFriendShips";
import {
  ArrowLeft,
  Check,
  UserRound,
  UserRoundPlus,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { Button } from "@/components/ui";
import { cn } from "@/utils";
import { useUserStore } from "@/store/user";
import acceptRequest from "@/services/acceptRequest";

enum Tab {
  RECEIVED = "Received",
  SENT = "Sent",
}

export default function Requests() {
  const currentUser = useUserStore((status) => status.user);
  const [friendShips, setFriendShips] = useState<FriendShip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(Tab.RECEIVED);

  useEffect(() => {
    const fetchFriendShips = async () => {
      const { friendShips } = await getFriendShips();
      setFriendShips(friendShips);
      setIsLoading(false);
    };

    fetchFriendShips();

    const intervalId = setInterval(fetchFriendShips, 10000);

    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="flex flex-col bg-surface-a30">
        <div className="flex gap-2 font-bold text-lg p-2">
          <Link href="/directory" className="">
            <ArrowLeft size={32} />
          </Link>
          Friend request
        </div>
        <div className="flex rounded-b-md p-1 gap-1 bg-surface-a20">
          {Object.values(Tab).map((value) => (
            <Button
              key={value}
              className={cn(
                "flex-1 first:border-r border-surface-a20 p-1 text-lg font-bold rounded-md",
                value === tab ? "bg-surface-a0" : "hover:bg-surface-a10",
              )}
              onClick={() => setTab(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {currentUser?.id &&
          friendShips.map(({ requester, recipient, status }) => {
            const user = tab === Tab.SENT ? recipient : requester;

            if (currentUser.id === user.id) return;

            return (
              <div
                key={user.username}
                className="flex justify-between items-center p-2 bg-surface-a20 rounded-md"
              >
                <Link
                  href={`users/${user.username}/profile`}
                  className="flex flex-1 items-center gap-2"
                >
                  <div className="bg-surface-a0 rounded-full p-2">
                    <UserRound size={32} />
                  </div>
                  <div>
                    <b className="text-lg">{user.displayName}</b>
                    <p className="text-sm text-surface-a70">@{user.username}</p>
                  </div>
                </Link>
                {tab === Tab.SENT ? (
                  <b className="text-xl pr-2">
                    {status.slice(0, 1).toUpperCase() + status.slice(1)}
                  </b>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      className="bg-primary-a0 rounded-md p-2"
                      onClick={async () => {
                        await acceptRequest(user.id, currentUser.id);
                        setFriendShips((prev) =>
                          prev.filter(
                            (friendShips) =>
                              friendShips.requester.id !== user.id,
                          ),
                        );
                      }}
                    >
                      <UserRoundPlus />
                    </Button>
                    <Button
                      className="bg-red-500 rounded-md p-2"
                      onClick={async () => {
                        await acceptRequest(user.id, currentUser.id);
                        setFriendShips((prev) =>
                          prev.filter(
                            (friendShips) =>
                              friendShips.requester.id !== user.id,
                          ),
                        );
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
}
