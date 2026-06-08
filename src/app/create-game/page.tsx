"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGame } from "@/lib/gameService";

export default function CreateGamePage() {
  const router = useRouter();

  const [playerName, setPlayerName] =
    useState("");

  const createGameHandler =
    async () => {
      if (!playerName.trim()) {
        alert("Vul eerst je naam in");
        return;
      }

      const gameCode =
        Math.floor(
          1000 +
            Math.random() * 9000
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

      router.push("/lobby");
    };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Nieuw Spel
      </h1>

      <input
        type="text"
        placeholder="Jouw naam"
        value={playerName}
        onChange={(e) =>
          setPlayerName(
            e.target.value
          )
        }
        className="text-black p-3 rounded mb-6 w-72"
      />

      <button
        onClick={
          createGameHandler
        }
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        Maak Spel
      </button>
    </main>
  );
}