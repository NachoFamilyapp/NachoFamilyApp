"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

      const cleanGameCode =
        gameCode.trim();

      const gameRef = doc(
        db,
        "games",
        cleanGameCode
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
        cleanGameCode
      );

      localStorage.setItem(
        "host",
        "false"
      );

      router.push(
        "/lobby"
      );
    } catch (error) {
      console.error(
        error
      );

      alert(
        "Join Game mislukt"
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
          className="bg-yellow-600 text-black px-4 py-2 rounded-xl font-bold"
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
              Doe mee met een bestaand spel
            </p>
          </div>

          <div className="mb-5">
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

          <div className="mb-6">
            <label className="block mb-2 font-bold">
              Game Code
            </label>

            <input
              type="text"
              placeholder="1234"
              value={gameCode}
              onChange={(e) =>
                setGameCode(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-xl text-black text-lg text-center font-bold tracking-widest"
            />
          </div>

          <button
            type="button"
            onClick={joinGame}
            className="w-full bg-red-600 hover:bg-red-500 p-4 rounded-xl text-xl font-bold"
          >
            🚀 Join Game
          </button>

          <Link
            href="/create-game"
            className="block text-center mt-6 text-green-100 underline"
          >
            Nog geen spel aangemaakt?
          </Link>
        </div>
      </div>
    </main>
  );
}