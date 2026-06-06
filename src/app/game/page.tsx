"use client";

import dynamic from "next/dynamic";

const GameField = dynamic(
  () => import("@/components/GameField"),
  {
    ssr: false,
  }
);

export default function GamePage() {
  return (
    <main className="min-h-screen bg-green-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">
        Capture The Flag
      </h1>

      <div className="bg-green-800 p-4 rounded-xl mb-4">
        Live Speelkaart
      </div>

      <GameField />
    </main>
  );
}