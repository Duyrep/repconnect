import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/components";
import BotNavBar from "@/components/layout/BotNavBar";

export const metadata: Metadata = {
  title: "RepConnect",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="w-full h-dvh flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
