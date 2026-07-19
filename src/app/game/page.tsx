"use client";

import dynamic from "next/dynamic";

import { useGame } from "@/components/GameProvider";
import GameControls from "@/components/GameControls";
import GameInfoBar from "@/components/GameInfoBar";

import GameService from "@/lib/gameService";

const GameMap = dynamic(
  () => import("@/components/GameMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        Kaart laden...
      </div>
    ),
  }
);

export default function GamePage() {

  const { game } = useGame();

  const isHost = GameService.isHost(game);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-4">

      <GameInfoBar />

      {isHost && (
        <GameControls />
      )}

      <GameMap />

    </main>
  );

}
