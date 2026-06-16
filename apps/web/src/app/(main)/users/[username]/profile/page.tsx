"use client";

import { useUserStore } from "@/store/user";
import { ArrowLeft, CircleUserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@/interfaces";
import { useParams, useRouter } from "next/navigation";
import getUserByUsername from "@/services/getUserByUsername";
import Loading from "@/app/(main)/loading";
import Link from "next/link";

export default function Profile() {
  const { username } = useParams() as { username: string };
  const router = useRouter();

  const getCurrentUsername = useUserStore((status) => status.getUsername);
  const [user, setUser] = useState<undefined | User>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    const { user, status } = await getUserByUsername(username);
    if (status !== 404) setUser(user);
    setIsLoading(false);
    if (getCurrentUsername() === user.username) router.push("/me");
  };

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) return <Loading />;

  if (!user)
    return (
      <b className="flex justify-center items-center w-full h-full text-2xl">
        No user found
      </b>
    );

  return (
    <>
      <nav className="flex items-center p-2 bg-surface-a30 rounded-b-md h-14">
        <Link href="/chat">
          <ArrowLeft size={32} />
        </Link>
      </nav>
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col gap-4 justify-center items-center bg-surface-a10 rounded-md p-16">
          <CircleUserRound size={96} strokeWidth={1} />
          <div className="flex flex-col items-center">
            <b className="text-2xl">{user.displayName}</b>
            <p>@{user.username}</p>
          </div>
        </div>
      </div>
    </>
  );
}
