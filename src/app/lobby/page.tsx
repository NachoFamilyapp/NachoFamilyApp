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
      localStorage.getItem("gameCode") || "";

    const storedPlayer =
      localStorage.getItem("playerName") || "";

    setGameCode(storedCode);
    setPlayerName(storedPlayer);

    if (!storedCode) return;

    const gameRef = doc(
      db,
      "games",
      storedCode
    );

    const unsubscribe =
      onSnapshot(gameRef, (snapshot) => {
        if (!snapshot.exists()) return;

        const data = snapshot.data();

        setPlayers(data.players || []);

        if (data.status === "playing") {
          router.push("/game");
        }

        const me = data.players?.find(
          (p: Player) =>
            p.name === storedPlayer
        );

        setIsHost(me?.host || false);
      });

    return () => unsubscribe();
  }, [router]);

  const startGame = async () => {
    const gameRef = doc(
      db,
      "games",
      gameCode
    );

    await updateDoc(gameRef, {
      status: "playing",
    });
  };

  return (
    <main className="min-h-screen bg-green-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6">
        Lobby
      </h1>

      <div className="bg-green-800 p-6 rounded-xl mb-6 w-full max-w-md text-center">
        <div className="text-lg">
          Game Code
        </div>

        <div className="text-4xl font-bold">
          {gameCode}
        </div>
      </div>

      <div className="bg-white text-black rounded-xl p-6 w-full max-w-md mb-6">
        <h2 className="font-bold text-2xl mb-4">
          Spelers
        </h2>

        {players.length === 0 ? (
          <p>Geen spelers gevonden</p>
        ) : (
          players.map(
            (player, index) => (
              <div
                key={index}
                className="mb-3 text-lg"
              >
                {player.host && "👑 "}

                {player.name}

                {player.team === "red" &&
                  " 🔴"}

                {player.team === "blue" &&
                  " 🔵"}
              </div>
            )
          )
        )}
      </div>

      <Link
        href="/team-select"
        className="bg-blue-600 px-8 py-4 rounded-xl text-xl mb-4"
      >
        Kies Team
      </Link>

      {isHost ? (
        <button
          onClick={startGame}
          className="bg-green-600 px-8 py-4 rounded-xl text-xl"
        >
          ▶ Start Spel
        </button>
      ) : (
        <div className="text-xl">
          ⏳ Wachten op host...
        </div>
      )}
    </main>
  );
}