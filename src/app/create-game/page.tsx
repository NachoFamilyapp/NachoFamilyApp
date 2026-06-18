"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createGame } from "@/lib/gameService";

export default function CreateGamePage() {
  const router = useRouter();

  const [playerName, setPlayerName] =
    useState("");

  const createGameHandler =
    async () => {
      try {
        if (
          !playerName.trim()
        ) {
          alert(
            "Vul eerst je naam in"
          );
          return;
        }

        const gameCode =
          Math.floor(
            1000 +
              Math.random() *
                9000
          ).toString();

        await createGame(
          gameCode,
          playerName
        );

        localStorage.setItem(
          "playerName",
          playerName
        );

        localStorage.setItem(
          "gameCode",
          gameCode
        );

        localStorage.setItem(
          "host",
          "true"
        );

        router.push(
          "/lobby"
        );
      } catch (error) {
        console.error(
          error
        );

        alert(
          "Spel maken mislukt"
        );
      }
    };

  return (
    <main className="min-h-screen bg-green-900 text-white">
      <nav className="bg-green-950 border-b border-green-700 p-4 flex flex-wrap gap-2 justify-center">
        <Link
          href="/"
          className="bg-green-700 px-4 py-2 rounded-xl font-bold"
        >
          🏠 Home
        </Link>

        <Link
          href="/join-game"
          className="bg-red-700 px-4 py-2 rounded-xl font-bold"
        >
          🎮 Join
        </Link>

        <Link
          href="/lobby"
          className="bg-blue-700 px-4 py-2 rounded-xl font-bold"
        >
          👥 Lobby
        </Link>

        <Link
          href="/admin"
          className="bg-yellow-600 text-black px-4 py-2 rounded-xl font-bold"
        >
          ⚙️ Beheer
        </Link>
      </nav>

      <div className="max-w-md mx-auto px-6 py-12">
        <div className="bg-green-800 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              ➕
            </div>

            <h1 className="text-4xl font-bold mb-2">
              Nieuw Spel
            </h1>

            <p className="text-green-100">
              Maak een nieuw spel aan
            </p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold">
              Jouw Naam
            </label>

            <input
              type="text"
              placeholder="Bijvoorbeeld: Papa"
              value={playerName}
              onChange={(e) =>
                setPlayerName(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-xl text-black text-lg"
            />
          </div>

          <button
            type="button"
            onClick={
              createGameHandler
            }
            className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-xl text-xl font-bold"
          >
            🚀 Maak Spel
          </button>

          <Link
            href="/join-game"
            className="block text-center mt-6 text-green-100 underline"
          >
            Heb je al een game code?
          </Link>
        </div>
      </div>
    </main>
  );
}