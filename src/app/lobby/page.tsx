"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface Player {
  name: string;
  host: boolean;
  team?: string;
}

export default function LobbyPage() {
  const router = useRouter();

  const [gameCode, setGameCode] =
    useState("");

  const [playerName, setPlayerName] =
    useState("");

  const [players, setPlayers] =
    useState<Player[]>([]);

  const [isHost, setIsHost] =
    useState(false);

  useEffect(() => {
    const storedCode =
      localStorage.getItem(
        "gameCode"
      ) || "";

    const storedPlayer =
      localStorage.getItem(
        "playerName"
      ) || "";

    setGameCode(storedCode);
    setPlayerName(storedPlayer);

    if (!storedCode) return;

    const gameRef = doc(
      db,
      "games",
      storedCode
    );

    const unsubscribe =
      onSnapshot(
        gameRef,
        (snapshot) => {
          if (!snapshot.exists())
            return;

          const data =
            snapshot.data();

          setPlayers(
            data.players || []
          );

          if (
            data.status ===
            "playing"
          ) {
            router.push(
              "/game"
            );
          }

          const me =
            data.players?.find(
              (
                p: Player
              ) =>
                p.name ===
                storedPlayer
            );

          setIsHost(
            me?.host ||
              false
          );
          console.log(
  "Stored Player:",
  storedPlayer
);

console.log(
  "Found Player:",
  me
);
        }
      );

    return () =>
      unsubscribe();
  }, [router]);

  const startGame =
    async () => {
      const gameRef = doc(
        db,
        "games",
        gameCode
      );

      await updateDoc(
        gameRef,
        {
          status:
            "playing",
        }
      );
    };

  return (
    <main className="min-h-screen bg-green-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6">
        Lobby
      </h1>

      <div className="text-3xl font-bold mb-8">
        Game Code:
        {" "}
        {gameCode}
      </div>

      <div className="bg-white text-black rounded-xl p-6 w-96 mb-8">
        <h2 className="font-bold text-xl mb-4">
          Spelers
        </h2>

        {players.map(
          (
            player,
            index
          ) => (
            <div
              key={index}
              className="mb-3"
            >
              {player.host &&
                "👑 "}

              {
                player.name
              }

              {" "}

              {player.team ===
                "red" &&
                "🔴"}

              {player.team ===
                "blue" &&
                "🔵"}
            </div>
          )
        )}
      </div>

      <Link
        href="/team-select"
        className="bg-blue-600 px-6 py-3 rounded-xl mb-4"
      >
        Kies Team
      </Link>

      {isHost && (
        <button
          onClick={
            startGame
          }
          className="bg-green-600 px-8 py-4 rounded-xl text-xl"
        >
          ▶ Start Spel
        </button>
      )}
    </main>
  );
}