"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import GameInfoBar from "@/components/GameInfoBar";

interface WinnerData {
  team?: string;
  playerName?: string;
}

export default function ResultsPage() {
  const router = useRouter();

  const [winner, setWinner] =
    useState<WinnerData | null>(null);

  useEffect(() => {
    const gameCode =
      localStorage.getItem("gameCode");

    if (!gameCode) {
      return;
    }

    const gameRef = doc(
      db,
      "games",
      gameCode
    );

    const unsubscribe =
      onSnapshot(
        gameRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            return;
          }

          const data = snapshot.data();

          setWinner({
            team: data.winner ?? undefined,
            playerName: data.winnerPlayer ?? undefined,
          });
        }
      );

    return () => unsubscribe();
  }, []);

  const startNewGame = () => {
    localStorage.removeItem("gameCode");
    localStorage.removeItem("team");
    localStorage.removeItem("isHost");
    localStorage.removeItem("playArea");
    localStorage.removeItem("redFlag");
    localStorage.removeItem("blueFlag");
    localStorage.removeItem("gameSettings");

    router.push("/create-game");
  };

  const winningTeam =
    winner?.team === "red"
      ? "ROOD"
      : winner?.team === "blue"
        ? "BLAUW"
        : "ONBEKEND";

  return (
    <main className="min-h-screen bg-black/30 backdrop-blur-sm text-white">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <GameInfoBar />

        <div className="mt-6 rounded-3xl bg-yellow-400 p-8 text-center text-black">
          <div className="mb-4 text-7xl">
            🏆
          </div>

          <h1 className="text-4xl font-bold">
            TEAM {winningTeam} WINT!
          </h1>

          {winner?.playerName && (
            <div className="mt-6 rounded-2xl bg-white p-5 text-xl font-bold">
              🚩 {winner.playerName} bracht de vlag thuis!
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4">
          <button
            type="button"
            onClick={startNewGame}
            className="rounded-2xl bg-blue-600 p-5 text-center text-xl font-bold"
          >
            🔄 Nieuw Spel
          </button>

          <Link
            href="/"
            className="rounded-2xl bg-green-600 p-5 text-center text-xl font-bold"
          >
            🏠 Terug naar Home
          </Link>
        </div>
      </div>
    </main>
  );
}