"use client";

import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/chat");
  }, []);

  return (
    <>
      <div className="flex justify-center items-center">
        <Button
          onClick={async () => {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
              method: "POST",
              credentials: "include",
            });
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </>
  );
}
