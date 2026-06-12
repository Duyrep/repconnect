"use client";

import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-dvh flex flex-col gap-4 justify-center items-center bg-background">
      <div className="flex gap-2 justify-center items-center text-2xl">
        <b>Loading</b>
        <LoaderCircle className="animate-spin" />
      </div>
      {showSlowMessage && (
        <div className="flex flex-col items-center gap-1 text-sm mt-4">
          <p className="text-muted-foreground">
            Why do I have to wait so long?
          </p>
          <Link href="/about" className="text-primary-a0 hover:underline">
            Read more about this
          </Link>
        </div>
      )}
    </div>
  );
}
