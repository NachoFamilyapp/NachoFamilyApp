"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LobbyPage() {
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");

  useEffect(() => {
    setPlayerName(localStorage.getItem("playerName") || "");
    setGameCode(localStorage.getItem("gameCode") || "");
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white">
      <h1 className="text-4xl font-bold mb-6">
        Lobby
      </h1>

      <div className="text-3xl font-bold mb-6">
        Game Code: {gameCode}
      </div>

      <div className="mb-8">
        <p>Host: {playerName}</p>
      </div>

      <Link
        href="/team-select"
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        Team Kiezen
      </Link>
    </main>
  );
}