"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import GameInfoBar from "@/components/GameInfoBar";

const MapPicker = dynamic(
  () => import("@/components/MapPicker"),
  {
    ssr: false,
  }
);

export default function AdminPage() {
  const [duration, setDuration] =
    useState<number | null>(
      null
    );

  const [gpsTestMode, setGpsTestMode] =
    useState(false);

  const saveSettings =
    async () => {
      try {
        const gameCode =
          localStorage.getItem(
            "gameCode"
          );

        if (!gameCode) {
          alert(
            "Geen gamecode gevonden"
          );
          return;
        }

        const gameRef = doc(
          db,
          "games",
          gameCode
        );

        await updateDoc(
          gameRef,
          {
            "settings.gameDuration":
              duration ?? 86400,
            gpsTestMode:
              gpsTestMode,
          }
        );

        alert(
          "✅ Instellingen opgeslagen"
        );
      } catch (error) {
        console.error(
          error
        );

        alert(
          "Opslaan mislukt"
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
          href="/game"
          className="bg-purple-700 px-4 py-2 rounded-xl font-bold"
        >
          🗺️ Game
        </Link>

        <Link
          href="/join-game"
          className="bg-red-700 px-4 py-2 rounded-xl font-bold"
        >
          🎮 Join
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <GameInfoBar />

        <div className="bg-green-800 rounded-3xl p-8 mt-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              ⚙️
            </div>

            <h1 className="text-4xl font-bold">
              Beheer
            </h1>

            <p className="text-green-100 mt-2">
              Stel het spel in voordat je start
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4">
            ⏱️ Spelduur
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              onClick={() =>
                setDuration(300)
              }
              className="bg-blue-600 p-4 rounded-xl font-bold"
            >
              5 min
            </button>

            <button
              onClick={() =>
                setDuration(600)
              }
              className="bg-blue-600 p-4 rounded-xl font-bold"
            >
              10 min
            </button>

            <button
              onClick={() =>
                setDuration(900)
              }
              className="bg-blue-600 p-4 rounded-xl font-bold"
            >
              15 min
            </button>

            <button
              onClick={() =>
                setDuration(1200)
              }
              className="bg-blue-600 p-4 rounded-xl font-bold"
            >
              20 min
            </button>

            <button
              onClick={() =>
                setDuration(2700)
              }
              className="bg-blue-600 p-4 rounded-xl font-bold"
            >
              45 min
            </button>

            <button
              onClick={() =>
                setDuration(3600)
              }
              className="bg-blue-600 p-4 rounded-xl font-bold"
            >
              60 min
            </button>

            <button
              onClick={() =>
                setDuration(5400)
              }
              className="bg-blue-600 p-4 rounded-xl font-bold"
            >
              90 min
            </button>

            <button
              onClick={() =>
                setDuration(null)
              }
              className="bg-purple-600 p-4 rounded-xl font-bold"
            >
              ♾️ Oneindig
            </button>
          </div>

          <div className="bg-green-700 p-4 rounded-xl mb-8">
            <strong>
              Geselecteerd:
            </strong>{" "}
            {duration === null
              ? "♾️ Oneindig"
              : `${Math.floor(
                  duration / 60
                )} minuten`}
          </div>

          <h2 className="text-2xl font-bold mb-4">
            📍 GPS Test Mode
          </h2>

          <button
            onClick={() =>
              setGpsTestMode(
                !gpsTestMode
              )
            }
            className={`w-full p-4 rounded-xl text-xl font-bold mb-8 ${
              gpsTestMode
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {gpsTestMode
              ? "✅ GPS Test Mode AAN"
              : "❌ GPS Test Mode UIT"}
          </button>

          <button
            onClick={
              saveSettings
            }
            className="w-full bg-green-600 p-5 rounded-2xl text-xl font-bold mb-8"
          >
            💾 Instellingen Opslaan
          </button>
        </div>

        <div className="bg-green-800 rounded-3xl p-8 mt-6">
          <h2 className="text-3xl font-bold mb-6">
            🗺️ Speelgebied & Vlaggen
          </h2>

          <MapPicker />
        </div>
      </div>
    </main>
  );
}