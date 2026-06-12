"use client";

import BotNavBar from "@/components/layout/BotNavBar";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/components/ui";
import { DialogFooter } from "@/components/ui/Dialog";
import { FriendShipStatus } from "@/enums";
import { User } from "@/interfaces";
import { getIndividualConversation, getFriends } from "@/services";
import {
  requestFriend,
  getUserByUsername,
  createConversation,
} from "@/services";
import { useUserStore } from "@/store/user";
import {
  ArrowRight,
  LoaderCircle,
  Plus,
  Search,
  UserRound,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

enum SearchStatus {
  NONE,
  SEARCHING,
  NOT_FOUND,
}

export default function Directory() {
  const router = useRouter();
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const { friends } = await getFriends();

      setFriends(friends);
    };

    fetchFriends();

    const intervalId = setInterval(fetchFriends, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <nav className="px-4 py-2 text-2xl">
        <b>Directory</b>
      </nav>
      <main className="relative flex flex-col gap-4 w-full h-full p-4">
        <AddFriendDialog />
        <Link
          href={"/requests"}
          className="flex justify-between items-center w-full font-bold bg-surface-a30 rounded-md p-4 hover:bg-surface-a20"
        >
          <div className="flex gap-2">
            <UsersRound />
            Friend requests
          </div>

          <div className="pr-2">
            <ArrowRight />
          </div>
        </Link>
        <hr className="border-surface-a30" />
        <div className="flex flex-col gap-2">
          {friends.map(({ id, username, displayName }) => (
            <Button
              key={id}
              className="flex items-center justify-between rounded-md bg-surface-a20 p-2 gap-2"
              onClick={async () => {
                const { conversation } = await getIndividualConversation(id);
                router.push(`/chat/${conversation.id}`);
              }}
            >
              <div className="flex gap-2 items-center">
                <div className="rounded-full p-2 bg-surface-a0">
                  <UserRound size={32} />
                </div>
                <div>
                  <b>{displayName}</b>
                  <p className="text-sm text-surface-a70">@{username}</p>
                </div>
              </div>
              <div className="pr-2">
                <ArrowRight />
              </div>
            </Button>
          ))}
        </div>
      </main>
      <BotNavBar />
    </>
  );
}

function AddFriendDialog() {
  const user = useUserStore((status) => status.user);
  const getUsername = useUserStore((status) => status.getUsername);
  const [userSearched, setUserSearched] = useState<undefined | User>(undefined);
  const [searchUsername, setSearchUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(
    SearchStatus.NONE,
  );

  const searchUser = async () => {
    if (searchUsername === getUsername()) {
      setSearchStatus(SearchStatus.NOT_FOUND);
      return;
    }
    const { user, status } = await getUserByUsername(searchUsername);
    if (status !== 200) {
      setUserSearched(undefined);
      setSearchStatus(SearchStatus.NOT_FOUND);
    } else {
      setUserSearched(user);
      setSearchStatus(SearchStatus.NONE);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedUsername(searchUsername), 500);
    return () => clearTimeout(timer);
  }, [searchUsername]);

  useEffect(() => {
    if (debouncedUsername) {
      searchUser();
    }
  }, [debouncedUsername]);

  return (
    <Dialog
      onOpenChange={() => {
        setUserSearched(undefined);
        setSearchUsername("");
        setDebouncedUsername("");
        setSearchStatus(SearchStatus.NONE);
      }}
    >
      <DialogTrigger className="absolute right-0 bottom-0 m-4 p-3 bg-primary-a0 rounded-md hover:bg-primary-a10">
        <UserRoundPlus size={24} />
      </DialogTrigger>
      <DialogContent className="min-w-min flex flex-col max-sm:w-[calc(100%-2rem)] sm:w-lg">
        <DialogTitle>Add friend</DialogTitle>
        <div className="p-2 flex flex-col gap-2">
          <div className="flex gap-2 items-center border border-surface-a30 rounded-md px-2">
            <Input
              className="w-full border-0 px-1"
              placeholder="Enter the username to search"
              onChange={(e) => {
                setSearchUsername(e.target.value);
                setSearchStatus(SearchStatus.SEARCHING);
                if (!e.target.value) setSearchStatus(SearchStatus.NONE);
              }}
            />
            <Search strokeWidth={3} size={32} />
          </div>
          {searchStatus === SearchStatus.NONE ? (
            userSearched && (
              <div className="flex justify-between bg-surface-a20 rounded-md p-2 gap-2">
                <Link
                  href={`/users/${userSearched?.username}/profile`}
                  className="flex items-center flex-1 gap-2"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-surface-a10 rounded-full">
                      <UserRound size={32} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <b>{userSearched?.displayName}</b>
                    <p className="text-sm text-surface-a70">
                      @{userSearched?.username}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center">
                  {userSearched.friendShipStatus ===
                  FriendShipStatus.ACCEPTED ? (
                    <b className="pr-2">Friend</b>
                  ) : (
                    <Button
                      className="flex bg-primary-a0 rounded-md p-2"
                      onClick={async () => {
                        if (user?.id)
                          await requestFriend(user.id, userSearched.id);
                      }}
                    >
                      <Plus />
                    </Button>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="text-center text-xl font-bold">
              {searchStatus === SearchStatus.SEARCHING ? (
                <div className="flex gap-2 justify-center items-center">
                  <p>Searching</p>
                  <LoaderCircle className="animate-spin" size={24} />
                </div>
              ) : searchStatus === SearchStatus.NOT_FOUND ? (
                "No user found"
              ) : (
                ""
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-row-reverse">
          <DialogClose />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
