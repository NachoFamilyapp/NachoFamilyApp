"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function JoinGamePage() {
  const router = useRouter();

  const [playerName, setPlayerName] =
    useState("");

  const [gameCode, setGameCode] =
    useState("");

  const joinGame = async () => {
    if (
      !playerName.trim() ||
      !gameCode.trim()
    ) {
      alert(
        "Vul naam en gamecode in"
      );
      return;
    }

    const gameRef = doc(
      db,
      "games",
      gameCode
    );

    const gameSnap =
      await getDoc(gameRef);

    if (!gameSnap.exists()) {
      alert(
        "Game bestaat niet"
      );
      return;
    }

   await updateDoc(gameRef, {
  players: arrayUnion({
    name: playerName,
    host: false,
  }),
});

    localStorage.setItem(
      "playerName",
      playerName
    );

    localStorage.setItem(
      "gameCode",
      gameCode
    );

    router.push("/lobby");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Spel Joinen
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
        className="text-black p-3 rounded mb-4 w-72"
      />

      <input
        type="text"
        placeholder="Game Code"
        value={gameCode}
        onChange={(e) =>
          setGameCode(
            e.target.value
          )
        }
        className="text-black p-3 rounded mb-6 w-72"
      />

      <button
        onClick={joinGame}
        className="bg-red-600 px-6 py-3 rounded-xl"
      >
        Join Game
      </button>
    </main>
  );
}