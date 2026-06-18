"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import GameInfoBar from "@/components/GameInfoBar";

const GameField = dynamic(
  () => import("@/components/GameField"),
  {
    ssr: false,
  }
);

export default function GamePage() {
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
          href="/admin"
          className="bg-yellow-600 text-black px-4 py-2 rounded-xl font-bold"
        >
          ⚙️ Beheer
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <GameInfoBar />

        <div className="bg-green-800 rounded-3xl p-6 mt-4 mb-4 text-center">
          <div className="text-6xl mb-3">
            🚩
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            Capture The Flag
          </h1>

          <p className="text-green-100 mt-2">
            Zoek de vlag van het andere team en verdedig je eigen vlag.
          </p>
        </div>

        <div className="bg-green-800 rounded-2xl p-4 mb-4 text-center text-xl font-bold">
          🗺️ Live Speelkaart
        </div>

        <div className="rounded-3xl overflow-hidden">
          <GameField />
        </div>
      </div>
    </main>
  );
}