import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";

export const metadata: Metadata = {
  title: "Veloce | Premium Video Experience",
  description: "Next-generation video streaming platform with adaptive bitrate and custom playlists.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
