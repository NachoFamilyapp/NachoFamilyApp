"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import GameInfoBar from "@/components/GameInfoBar";

interface Player {
  name: string;
  host: boolean;
  team?: string;
}

export default function LobbyPage() {
  const router = useRouter();

  const [gameCode, setGameCode] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const storedCode = localStorage.getItem("gameCode") || "";
    const storedPlayer = localStorage.getItem("playerName") || "";

    setGameCode(storedCode);

    if (!storedCode) {
      return;
    }

    const gameRef = doc(db, "games", storedCode);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      const data = snapshot.data();
      const gamePlayers: Player[] = data.players || [];

      setPlayers(gamePlayers);

      if (data.status === "playing") {
        router.push("/game");
      }

      const me = gamePlayers.find(
        (player) => player.name === storedPlayer
      );

      setIsHost(me?.host || false);
    });

    return () => unsubscribe();
  }, [router]);

  const startGame = async () => {
    try {
      const gameRef = doc(db, "games", gameCode);
      const gameSnap = await getDoc(gameRef);

      if (!gameSnap.exists()) {
        alert("Game niet gevonden");
        return;
      }

      const data = gameSnap.data();

      if (
        data.gameDuration === undefined
      ) {
        router.push("/admin");
        return;
      }

      if (
        !data.playArea ||
        data.playArea.length < 3
      ) {
        router.push("/admin");
        return;
      }

      const gamePlayers: Player[] = data.players || [];

      const missingTeam = gamePlayers.some(
        (player) => !player.team
      );

      if (missingTeam) {
        router.push("/team-select");
        return;
      }

      await updateDoc(gameRef, {
        status: "playing",
        startTime: Date.now(),
      });
    } catch (error) {
      console.error(error);
      alert("Starten mislukt");
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-green-900 text-white">
      <nav className="w-full border-b border-green-700 bg-green-950">
        <div className="mx-auto flex w-full max-w-2xl flex-wrap justify-center gap-2 px-3 py-4">
          <Link
            href="/"
            className="rounded-xl bg-green-700 px-4 py-2 font-bold"
          >
            🏠 Home
          </Link>

          <Link
            href="/create-game"
            className="rounded-xl bg-blue-700 px-4 py-2 font-bold"
          >
            ➕ Nieuw
          </Link>

          <Link
            href="/join-game"
            className="rounded-xl bg-red-700 px-4 py-2 font-bold"
          >
            🎮 Join
          </Link>

          <Link
            href="/admin"
            className="rounded-xl bg-yellow-600 px-4 py-2 font-bold text-black"
          >
            ⚙️ Beheer
          </Link>
        </div>
      </nav>

      <div className="mx-auto w-full max-w-2xl px-3 py-6 sm:px-6 sm:py-8">
        <div className="w-full min-w-0 overflow-hidden">
          <GameInfoBar />
        </div>

        <div className="mt-4 w-full min-w-0 rounded-3xl bg-green-800 p-6 text-center sm:p-8">
          <div className="mb-4 text-5xl sm:text-6xl">
            🎮
          </div>

          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
            Lobby
          </h1>

          <div className="mb-2 text-green-100">
            Game Code
          </div>

          <div className="break-all text-5xl font-bold tracking-wider sm:text-6xl sm:tracking-widest">
            {gameCode}
          </div>
        </div>

        <div className="mt-6 w-full min-w-0 rounded-3xl bg-white p-5 text-black sm:p-6">
          <h2 className="mb-4 text-2xl font-bold">
            👥 Spelers ({players.length})
          </h2>

          {players.length === 0 ? (
            <div>
              Geen spelers gevonden
            </div>
          ) : (
            players.map((player, index) => (
              <div
                key={`${player.name}-${index}`}
                className="flex min-w-0 items-center justify-between gap-3 border-b py-3"
              >
                <div className="min-w-0 break-words">
                  {player.host && "👑 "}
                  {player.name}
                </div>

                <div className="shrink-0">
                  {player.team === "red" && "🔴"}
                  {player.team === "blue" && "🔵"}
                  {!player.team && "⚪"}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 grid w-full gap-4">
          <Link
            href="/team-select"
            className="w-full rounded-2xl bg-blue-600 p-5 text-center text-xl font-bold"
          >
            👥 Kies Team
          </Link>

          {isHost ? (
            <button
              type="button"
              onClick={startGame}
              className="w-full rounded-2xl bg-green-600 p-5 text-xl font-bold"
            >
              ▶️ Start Spel
            </button>
          ) : (
            <div className="w-full rounded-2xl bg-yellow-600 p-5 text-center text-xl font-bold">
              ⏳ Wachten op host...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}