"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import GameInfoBar from "@/components/GameInfoBar";

import GameService from "@/lib/gameService";

import {
  Game,
  Player,
} from "@/types/game";

export default function LobbyPage() {

  const router = useRouter();

  const [game, setGame] =
    useState<Game | null>(null);

  const [loading, setLoading] =
    useState(true);

  const gameCode =
    GameService.getStoredGameCode();

  const playerId =
    GameService.getStoredPlayerId();

  useEffect(() => {

    if (!gameCode) {

      router.replace("/");

      return;

    }

    const unsubscribe =
      GameService.listenToGame(

        gameCode,

        (newGame) => {

          setGame(newGame);

          setLoading(false);

          if (!newGame)
            return;

          if (
            newGame.status === "running"
          ) {

            router.replace("/game");

          }

        }

      );

    return () => {

      unsubscribe();

    };

  }, [gameCode, router]);

  const players =
    useMemo(() => {

      if (!game)
        return [];

      return Object.values(
        game.players
      );

    }, [game]);

  const me =
    useMemo(() => {

      if (!game)
        return null;

      return (
        game.players[playerId] ??
        null
      );

    }, [game, playerId]);

  const isHost =
    me?.host ?? false;

  const canStart =
    GameService.canStartGame(
      game
    );

  async function startGame() {

    if (!game)
      return;

    if (!canStart) {

      alert(
        "Controleer teams en speelgebied."
      );

      return;

    }

    await GameService.startGame(
      game.gameCode
    );

  }

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-green-900 text-white">

        <div className="text-3xl font-bold">

          Lobby laden...

        </div>

      </main>

    );

  }

  if (!game) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-red-900 text-white">

        <div className="text-3xl font-bold">

          Game niet gevonden

        </div>

      </main>

    );

  }
    return (

    <main className="min-h-screen bg-green-900 text-white">

      <nav className="border-b border-green-700 bg-green-950">

        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 p-4">

          <Link
            href="/"
            className="rounded-xl bg-green-700 px-4 py-2 font-bold"
          >
            🏠 Home
          </Link>

          <Link
            href="/create-game"
            className="rounded-xl bg-blue-700 px-4 py-2 font-bold"
          >
            ➕ Nieuw
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

      <div className="mx-auto max-w-3xl p-5">

        <GameInfoBar />

        <div className="mt-5 rounded-3xl bg-green-800 p-6 text-center">

          <div className="mb-4 text-6xl">

            🎮

          </div>

          <h1 className="text-4xl font-bold">

            Lobby

          </h1>

          <p className="mt-5 text-green-200">

            Game Code

          </p>

          <div className="mt-2 text-6xl font-black tracking-[10px]">

            {game.gameCode}

          </div>

          <div className="mt-6 text-lg">

            Status:

            <span className="ml-2 font-bold">

              {game.status}

            </span>

          </div>

        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 text-black">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-2xl font-bold">

              👥 Spelers ({players.length})

            </h2>

            <div>

              Jij:

              <strong className="ml-2">

                {me?.name}

              </strong>

            </div>

          </div>

          {players.map((player) => (

            <div
              key={player.id}
              className="flex items-center justify-between border-b py-3"
            >

              <div>

                {player.host && "👑 "}

                {player.name}

              </div>

              <div className="flex gap-3">

                <span>

                  {player.team === "red" && "🔴"}

                  {player.team === "blue" && "🔵"}

                </span>

                <span>

                  {player.online ? "🟢" : "⚫"}

                </span>

              </div>

            </div>

          ))}

        </div>

        <div className="mt-6 grid gap-4">
                    <Link
            href="/team-select"
            className="w-full rounded-2xl bg-blue-600 p-5 text-center text-xl font-bold transition hover:bg-blue-500"
          >
            👥 Kies Team
          </Link>

          {isHost ? (
            <button
              type="button"
              onClick={startGame}
              disabled={!canStart}
              className={`w-full rounded-2xl p-5 text-xl font-bold transition ${
                canStart
                  ? "bg-green-600 hover:bg-green-500"
                  : "cursor-not-allowed bg-gray-500"
              }`}
            >
              ▶️ Start Spel
            </button>
          ) : (
            <div className="w-full rounded-2xl bg-yellow-600 p-5 text-center text-xl font-bold text-black">
              ⏳ Wachten op host...
            </div>
          )}

          {!canStart && isHost && (
            <div className="rounded-2xl border border-yellow-500 bg-yellow-100 p-4 text-center text-black">
              <div className="font-bold">
                Het spel kan nog niet gestart worden.
              </div>

              <div className="mt-2 text-sm">
                Controleer of:
              </div>

              <ul className="mt-2 list-inside list-disc text-left">
                <li>Er minimaal 2 spelers zijn.</li>
                <li>Beide teams minimaal 1 speler hebben.</li>
                <li>Het speelgebied is ingesteld.</li>
              </ul>
            </div>
          )}

        </div>

      </div>

    </main>

  );

}