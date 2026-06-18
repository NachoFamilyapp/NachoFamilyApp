"use client";

import Link from "next/link";

export default function Home() {
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
          href="/game"
          className="bg-purple-700 px-4 py-2 rounded-xl font-bold"
        >
          🗺️ Game
        </Link>

        <Link
          href="/admin"
          className="bg-yellow-600 text-black px-4 py-2 rounded-xl font-bold"
        >
          ⚙️ Beheer
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-green-800 rounded-3xl p-8 text-center shadow-xl">
          <div className="text-7xl mb-4">
            🚩
          </div>

          <h1 className="text-5xl font-bold mb-4">
            NachoFamilyApp
          </h1>

          <p className="text-xl text-green-100 mb-8">
            Capture The Flag • GPS Games • Familie Avonturen
          </p>

          <div className="grid gap-4 max-w-md mx-auto">
            <Link
              href="/create-game"
              className="bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl text-xl font-bold text-center"
            >
              ➕ Nieuw Spel
            </Link>

            <Link
              href="/join-game"
              className="bg-red-600 hover:bg-red-500 p-5 rounded-2xl text-xl font-bold text-center"
            >
              🎮 Spel Joinen
            </Link>

            <Link
              href="/lobby"
              className="bg-green-600 hover:bg-green-500 p-5 rounded-2xl text-xl font-bold text-center"
            >
              👥 Naar Lobby
            </Link>

            <Link
              href="/admin"
              className="bg-yellow-500 hover:bg-yellow-400 text-black p-5 rounded-2xl text-xl font-bold text-center"
            >
              ⚙️ Beheer
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-green-800 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">
              👥
            </div>

            <div className="font-bold">
              Teams
            </div>

            <div className="text-sm text-green-100">
              Speel samen of tegen elkaar
            </div>
          </div>

          <div className="bg-green-800 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">
              🚩
            </div>

            <div className="font-bold">
              Verover de Vlag
            </div>

            <div className="text-sm text-green-100">
              Vind de vlag van de tegenstander
            </div>
          </div>

          <div className="bg-green-800 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">
              📍
            </div>

            <div className="font-bold">
              Live GPS
            </div>

            <div className="text-sm text-green-100">
              Volg spelers realtime
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}