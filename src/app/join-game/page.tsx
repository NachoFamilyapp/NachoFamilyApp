"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import GameService from "@/lib/gameService";

export default function JoinGamePage() {
  const router = useRouter();

  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function joinGameHandler() {
    if (!playerName.trim()) {
      alert("Vul je naam in.");
      return;
    }

    if (!gameCode.trim()) {
      alert("Vul een gamecode in.");
      return;
    }

    try {
      setLoading(true);

      await GameService.joinGame(
        gameCode.trim(),
        playerName.trim()
      );

      router.push("/lobby");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Join Game mislukt."
      );
    } finally {
      setLoading(false);
    }
  }

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
          href="/create-game"
          className="bg-blue-700 px-4 py-2 rounded-xl font-bold"
        >
          ➕ Nieuw
        </Link>

        <Link
          href="/lobby"
          className="bg-purple-700 px-4 py-2 rounded-xl font-bold"
        >
          👥 Lobby
        </Link>

        <Link
          href="/admin"
          className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold"
        >
          ⚙️ Beheer
        </Link>
      </nav>

      <div className="max-w-md mx-auto px-6 py-12">
        <div className="bg-green-800 rounded-3xl p-8 shadow-xl">

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              🎮
            </div>

            <h1 className="text-4xl font-bold mb-2">
              Spel Joinen
            </h1>

            <p className="text-green-100">
              Doe mee met een bestaand spel.
            </p>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold">
              Jouw naam
            </label>

            <input
              type="text"
              value={playerName}
              onChange={(e) =>
                setPlayerName(e.target.value)
              }
              placeholder="Bijvoorbeeld: Papa"
              className="w-full rounded-xl p-4 text-black"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 font-bold">
              Gamecode
            </label>

            <input
              type="text"
              value={gameCode}
              onChange={(e) =>
                setGameCode(
                  e.target.value.replace(/\s/g, "")
                )
              }
              placeholder="1234"
              maxLength={4}
              className="w-full rounded-xl p-4 text-black text-center text-2xl tracking-[0.4em] font-bold"
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={joinGameHandler}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-500 rounded-xl p-4 text-xl font-bold"
          >
            {loading
              ? "Verbinden..."
              : "🚀 Join Game"}
          </button>

          <Link
            href="/create-game"
            className="block text-center mt-6 underline"
          >
            Nog geen spel aangemaakt?
          </Link>

        </div>
      </div>
    </main>
  );
}