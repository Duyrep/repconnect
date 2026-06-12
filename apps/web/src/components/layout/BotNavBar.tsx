"use client";

import { cn } from "@/utils";
import { BookUser, MessageCircle, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BotNavBar() {
  const pathname = usePathname();

  return (
    <nav className="rounded-t-md bg-surface-a30 flex gap-1 p-1">
      {[
        { label: "Chat", href: ["/chat"], Icon: MessageCircle },
        {
          label: "directory",
          href: ["/directory", "/requests"],
          Icon: BookUser,
        },
        { label: "Me", href: ["/me"], Icon: UserRound },
      ].map(({ label, href, Icon }) => (
        <Link
          key={`bot-nav-${label}`}
          href={href[0]}
          className={cn(
            "p-2 flex flex-1 justify-center rounded-md",
            href.includes(pathname) ? "bg-surface-a10" : "hover:bg-surface-a20",
          )}
        >
          <Icon />
        </Link>
      ))}
    </nav>
  );
}
