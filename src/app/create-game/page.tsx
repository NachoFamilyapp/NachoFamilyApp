"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import GameService from "@/lib/gameService";

export default function CreateGamePage() {

  const router = useRouter();

  const [playerName, setPlayerName] =
    useState("");

  async function createGameHandler() {

    try {

      if (!playerName.trim()) {

        alert("Vul eerst je naam in.");

        return;

      }

      const game = await GameService.createGame(
        playerName.trim()
      );

      router.push("/lobby");

    } catch (error) {

  console.error("CREATE GAME ERROR:", error);

  alert(
    error instanceof Error
      ? error.message
      : String(error)
  );

}

  }
    return (

    <main className="min-h-screen bg-green-900 text-white">

      <nav className="flex flex-wrap justify-center gap-2 border-b border-green-700 bg-green-950 p-4">

        <Link
          href="/"
          className="rounded-xl bg-green-700 px-4 py-2 font-bold"
        >
          🏠 Home
        </Link>

        <Link
          href="/join-game"
          className="rounded-xl bg-red-700 px-4 py-2 font-bold"
        >
          🎮 Join
        </Link>

        <Link
          href="/lobby"
          className="rounded-xl bg-blue-700 px-4 py-2 font-bold"
        >
          👥 Lobby
        </Link>

        <Link
          href="/admin"
          className="rounded-xl bg-yellow-600 px-4 py-2 font-bold text-black"
        >
          ⚙️ Beheer
        </Link>

      </nav>

      <div className="mx-auto max-w-md px-6 py-12">

        <div className="rounded-3xl bg-green-800 p-8 shadow-xl">

          <div className="mb-8 text-center">

            <div className="mb-4 text-6xl">
              ➕
            </div>

            <h1 className="mb-2 text-4xl font-bold">
              Nieuw Spel
            </h1>

            <p className="text-green-100">
              Maak een nieuw spel aan
            </p>

          </div>

          <div className="mb-6">

            <label className="mb-2 block font-bold">
              Jouw naam
            </label>

            <input
              type="text"
              value={playerName}
              placeholder="Bijvoorbeeld: Papa"
              onChange={(e) =>
                setPlayerName(e.target.value)
              }
              className="w-full rounded-xl p-4 text-lg text-black"
            />

          </div>

          <button
            type="button"
            onClick={createGameHandler}
            className="w-full rounded-xl bg-blue-600 p-4 text-xl font-bold hover:bg-blue-500"
          >
            🚀 Maak Spel
          </button>
                    <Link
            href="/join-game"
            className="mt-6 block text-center text-green-100 underline"
          >
            Heb je al een gamecode?
          </Link>

        </div>

      </div>

    </main>

  );

}