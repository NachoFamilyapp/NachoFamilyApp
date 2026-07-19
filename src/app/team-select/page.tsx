"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import GameInfoBar from "@/components/GameInfoBar";

import GameService from "@/lib/gameService";

import {
  Game,
  Team,
} from "@/types/game";

export default function TeamSelectPage() {

  const router = useRouter();

  async function selectTeam(
    team: Team
  ) {

    const gameCode =
      GameService.getStoredGameCode();

    const playerId =
      GameService.getStoredPlayerId();

    if (
      !gameCode ||
      !playerId
    ) {

      alert(
        "Game of speler niet gevonden."
      );

      return;

    }

    const game =
      await GameService.getGame(
        gameCode
      );

    if (!game) {

      alert(
        "Game niet gevonden."
      );

      return;

    }

    const player =
      game.players[playerId];

    if (!player) {

      alert(
        "Speler niet gevonden."
      );

      return;

    }

    player.team = team;

    player.lastUpdate =
      Date.now();

    await GameService.changeTeam(

      gameCode,

      playerId,

      team

    );

    router.replace(
      "/lobby"
    );

  }
    return (

    <main className="min-h-screen bg-black/30 backdrop-blur-sm text-white">

      <nav className="border-b border-green-700 bg-green-950">

        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 p-4">

          <Link
            href="/"
            className="rounded-xl bg-green-700 px-4 py-2 font-bold"
          >
            🏠 Home
          </Link>

          <Link
            href="/lobby"
            className="rounded-xl bg-blue-700 px-4 py-2 font-bold"
          >
            👥 Lobby
          </Link>

          <Link
            href="/join-game"
            className="rounded-xl bg-red-700 px-4 py-2 font-bold"
          >
            🎮 Join
          </Link>

          <Link
            href="/admin"
            className="rounded-xl bg-yellow-600 px-4 py-2 font-bold text-black"
          >
            ⚙️ Admin
          </Link>

        </div>

      </nav>

      <div className="mx-auto max-w-xl p-6">

        <GameInfoBar />

        <div className="mt-5 rounded-3xl bg-green-800 p-8">

          <div className="mb-8 text-center">

            <div className="mb-4 text-6xl">

              👥

            </div>

            <h1 className="text-4xl font-bold">

              Kies jouw Team

            </h1>

            <p className="mt-3 text-green-200">

              Je kunt je team later altijd wijzigen.

            </p>

          </div>

          <div className="grid gap-4">

            <button
              type="button"
              onClick={() => selectTeam("red")}
              className="rounded-2xl bg-red-600 p-5 text-xl font-bold transition hover:bg-red-500"
            >
              🔴 Team Rood
            </button>

            <button
              type="button"
              onClick={() => selectTeam("blue")}
              className="rounded-2xl bg-blue-600 p-5 text-xl font-bold transition hover:bg-blue-500"
            >
              🔵 Team Blauw
            </button>

          </div>

          <div className="mt-8 rounded-2xl bg-black/30 backdrop-blur-sm p-4 text-center text-sm text-green-200">

            Je keuze wordt direct realtime opgeslagen.
            Daarna ga je automatisch terug naar de lobby.

          </div>

        </div>

      </div>

    </main>

  );

}