import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/components";

export const metadata: Metadata = {
  title: "Login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="w-full h-dvh">{children}</body>
    </html>
  );
}
