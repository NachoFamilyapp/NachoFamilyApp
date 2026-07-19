import type { Metadata } from "next";
import "./globals.css";

import GameProvider from "@/components/GameProvider";
import ThemedBackground from "@/components/ThemedBackground";

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
          min-h-screen
          text-white
          touch-manipulation
          select-none
        "
      >
        <GameProvider>
          <ThemedBackground>{children}</ThemedBackground>
        </GameProvider>
      </body>
    </html>
  );
}