"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function JoinGamePage() {
  const router = useRouter();

  const [playerName, setPlayerName] =
    useState("");

  const [gameCode, setGameCode] =
    useState("");

  const joinGame = async () => {
    try {
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

      const data =
        gameSnap.data();

      const players =
        data.players || [];

      const playerExists =
        players.some(
          (player: any) =>
            player.name ===
            playerName
        );

      if (playerExists) {
        alert(
          "Naam is al in gebruik"
        );
        return;
      }

      await updateDoc(
        gameRef,
        {
          players: [
            ...players,
            {
              name: playerName,
              host: false,
              team: "",
            },
          ],
        }
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
        "false"
      );

      router.push(
        "/lobby"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Join Game mislukt"
      );
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white px-6">
      <h1 className="text-5xl font-bold mb-10">
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
        className="bg-white text-black p-4 rounded-xl mb-4 w-full max-w-sm border"
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
        className="bg-white text-black p-4 rounded-xl mb-8 w-full max-w-sm border"
      />

      <button
        type="button"
        onClick={joinGame}
        className="bg-red-600 px-8 py-4 rounded-xl text-xl"
      >
        Join Game
      </button>
    </main>
  );
}