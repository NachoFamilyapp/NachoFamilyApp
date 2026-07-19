"use client";

import { ReactNode } from "react";

import { useGame } from "@/components/GameProvider";
import { getBackground } from "@/config/backgrounds";

type Props = {
  children: ReactNode;
};

export default function ThemedBackground({ children }: Props) {

  const { game } = useGame();

  const background = getBackground(game?.settings?.theme);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${background.gradient} transition-colors duration-700`}
    >
      {children}
    </div>
  );
}
