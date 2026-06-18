"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import GameInfoBar from "@/components/GameInfoBar";

export default function TeamSelectPage() {
  const router = useRouter();

  const selectTeam = async (
    team: string
  ) => {
    try {
      const playerName =
        localStorage.getItem(
          "playerName"
        ) || "";

      const gameCode =
        localStorage.getItem(
          "gameCode"
        ) || "";

      if (
        !playerName ||
        !gameCode
      ) {
        alert(
          "Speler of game niet gevonden"
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

      if (
        !gameSnap.exists()
      ) {
        alert(
          "Game bestaat niet"
        );
        return;
      }

      const data =
        gameSnap.data();

      const updatedPlayers =
        (
          data.players || []
        ).map(
          (player: any) =>
            player.name ===
            playerName
              ? {
                  ...player,
                  team,
                }
              : player
        );

      await updateDoc(
        gameRef,
        {
          players:
            updatedPlayers,
        }
      );

      localStorage.setItem(
        "team",
        team
      );

      router.push(
        "/lobby"
      );
    } catch (error) {
      console.error(
        error
      );

      alert(
        "Team kiezen mislukt"
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
          href="/lobby"
          className="bg-blue-700 px-4 py-2 rounded-xl font-bold"
        >
          👥 Lobby
        </Link>

        <Link
          href="/join-game"
          className="bg-red-700 px-4 py-2 rounded-xl font-bold"
        >
          🎮 Join
        </Link>

        <Link
          href="/admin"
          className="bg-yellow-600 text-black px-4 py-2 rounded-xl font-bold"
        >
          ⚙️ Beheer
        </Link>
      </nav>

      <div className="max-w-md mx-auto px-6 py-8">
        <GameInfoBar />

        <div className="bg-green-800 rounded-3xl p-8 mt-4">
          <div className="text-center">
            <div className="text-6xl mb-4">
              👥
            </div>

            <h1 className="text-4xl font-bold mb-2">
              Kies je Team
            </h1>

            <p className="text-green-100 mb-8">
              Kies een team om mee te spelen
            </p>
          </div>

          <div className="grid gap-4">
            <button
              type="button"
              onClick={() =>
                selectTeam("red")
              }
              className="bg-red-600 hover:bg-red-500 p-5 rounded-2xl text-xl font-bold"
            >
              🔴 Team Rood
            </button>

            <button
              type="button"
              onClick={() =>
                selectTeam("blue")
              }
              className="bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl text-xl font-bold"
            >
              🔵 Team Blauw
            </button>

            <button
              type="button"
              onClick={() =>
                selectTeam("green")
              }
              className="bg-green-600 hover:bg-green-500 p-5 rounded-2xl text-xl font-bold"
            >
              🟢 Team Groen
            </button>

            <button
              type="button"
              onClick={() =>
                selectTeam("yellow")
              }
              className="bg-yellow-500 hover:bg-yellow-400 text-black p-5 rounded-2xl text-xl font-bold"
            >
              🟡 Team Geel
            </button>
          </div>

          <div className="mt-8 text-center text-green-100">
            Je kunt later altijd opnieuw een team kiezen.
          </div>
        </div>
      </div>
    </main>
  );
}