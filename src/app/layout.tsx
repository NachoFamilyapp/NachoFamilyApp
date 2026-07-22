import type { Metadata, Viewport } from "next";
import "./globals.css";

import GameProvider from "@/components/GameProvider";
import ThemedBackground from "@/components/ThemedBackground";
import UserProvider from "@/components/UserProvider";
import RequireProfile from "@/components/RequireProfile";

export const metadata: Metadata = {
  title: "Vakantie App",
  description: "Outdoor Multiplayer Family Game",
  applicationName: "Vakantie App",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vakantie App",
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
        <UserProvider>
          <GameProvider>
            <ThemedBackground>
              <RequireProfile>{children}</RequireProfile>
            </ThemedBackground>
          </GameProvider>
        </UserProvider>
      </body>
    </html>
  );
}