import type { Metadata } from "next";
import "./globals.css";

import GameProvider from "@/components/GameProvider";

export const metadata: Metadata = {
  title: "NachoFamilyApp",
  description: "Outdoor Multiplayer Family Game",
  applicationName: "NachoFamilyApp",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NachoFamilyApp",
  },
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className="
          bg-gradient-to-b
          from-green-500
          via-green-400
          to-blue-400
          text-white
          overflow-hidden
          touch-manipulation
          select-none
        "
      >
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}