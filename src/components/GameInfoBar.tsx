"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/components/GameProvider";

export default function GameInfoBar() {
  const { game, player } = useGame();

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (game?.status !== "running") return;

    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(interval);
  }, [game?.status]);

  let timeLeft = "—";

  if (
    game &&
    game.status === "running" &&
    game.startTime &&
    game.settings?.gameDuration
  ) {
    const end = game.startTime + game.settings.gameDuration * 1000;
    const remaining = Math.max(0, end - now);

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    timeLeft = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  if (!game) {
    return (
      <div className="rounded-2xl bg-green-800 p-4">
        Spel laden...
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-green-800 p-4 shadow-lg">
      <div className="grid gap-3 text-center md:grid-cols-4">
        <div className="rounded-xl bg-green-700 p-3">
          <div className="text-sm">Game</div>
          <div className="text-xl font-bold">
            {game.gameCode}
          </div>
        </div>

        <div className="rounded-xl bg-green-700 p-3">
          <div className="text-sm">Speler</div>
          <div className="font-bold">
            {player?.name ?? "-"}
          </div>
        </div>

        <div className="rounded-xl bg-green-700 p-3">
          <div className="text-sm">Team</div>
          <div className="font-bold">
            {player?.team === "red" && "🔴 Rood"}
            {player?.team === "blue" && "🔵 Blauw"}
            {!player?.team && "⚪ Geen"}
          </div>
        </div>

        <div className="rounded-xl bg-green-700 p-3">
          <div className="text-sm">Timer</div>
          <div className="text-xl font-bold">
            {timeLeft}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center font-bold">
        {game.status === "waiting" && "⏳ Lobby"}
        {game.status === "running" && "▶️ Actief"}
        {game.status === "paused" && "⏸️ Gepauzeerd"}
        {game.status === "finished" && "🏁 Beëindigd"}
      </div>
    </div>
  );
}