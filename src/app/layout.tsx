import type { Metadata, Viewport } from "next";
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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