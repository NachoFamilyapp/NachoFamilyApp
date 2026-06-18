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

  const [gameCode, setGameCode] =
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

    setGameCode(
      storedCode
    );

    if (!storedCode)
      return;

    const gameRef = doc(
      db,
      "games",
      storedCode
    );

    const unsubscribe =
      onSnapshot(
        gameRef,
        (snapshot) => {
          if (
            !snapshot.exists()
          )
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
        }
      );

    return () =>
      unsubscribe();
  }, [router]);

  const startGame =
    async () => {
      try {
        const gameRef = doc(
          db,
          "games",
          gameCode
        );

        const gameSnap =
          await getDoc(
            gameRef
          );

        if (
          !gameSnap.exists()
        ) {
          alert(
            "Game niet gevonden"
          );
          return;
        }

        const data =
          gameSnap.data();

        if (
          !data.gameDuration &&
          data.gameDuration !==
            null
        ) {
          alert(
            "⏱️ Kies eerst een timer"
          );
          return;
        }

        if (
          !data.playArea ||
          data.playArea
            .length < 3
        ) {
          alert(
            "🗺️ Maak eerst een speelgebied"
          );
          return;
        }

        const players =
          data.players ||
          [];

        const missingTeam =
          players.some(
            (
              player: Player
            ) =>
              !player.team
          );

        if (
          missingTeam
        ) {
          alert(
            "👥 Niet iedereen heeft een team gekozen"
          );
          return;
        }

        await updateDoc(
          gameRef,
          {
            status:
              "playing",
            startTime:
              Date.now(),
          }
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        alert(
          "Starten mislukt"
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
          href="/create-game"
          className="bg-blue-700 px-4 py-2 rounded-xl font-bold"
        >
          ➕ Nieuw
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

      <div className="max-w-2xl mx-auto px-6 py-8">
        <GameInfoBar />

        <div className="bg-green-800 rounded-3xl p-8 mt-4 text-center">
          <div className="text-6xl mb-4">
            🎮
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Lobby
          </h1>

          <div className="text-green-100 mb-2">
            Game Code
          </div>

          <div className="text-6xl font-bold tracking-widest">
            {gameCode}
          </div>
        </div>

        <div className="bg-white text-black rounded-3xl p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">
            👥 Spelers ({players.length})
          </h2>

          {players.length ===
          0 ? (
            <div>
              Geen spelers gevonden
            </div>
          ) : (
            players.map(
              (
                player,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="flex justify-between items-center border-b py-3"
                >
                  <div>
                    {player.host &&
                      "👑 "}
                    {
                      player.name
                    }
                  </div>

                  <div>
                    {player.team ===
                      "red" &&
                      "🔴"}

                    {player.team ===
                      "blue" &&
                      "🔵"}

                    {!player.team &&
                      "⚪"}
                  </div>
                </div>
              )
            )
          )}
        </div>

        <div className="grid gap-4 mt-6">
          <Link
            href="/team-select"
            className="bg-blue-600 p-5 rounded-2xl text-center text-xl font-bold"
          >
            👥 Kies Team
          </Link>

          {isHost ? (
            <button
              onClick={
                startGame
              }
              className="bg-green-600 p-5 rounded-2xl text-xl font-bold"
            >
              ▶️ Start Spel
            </button>
          ) : (
            <div className="bg-yellow-600 text-center p-5 rounded-2xl text-xl font-bold">
              ⏳ Wachten op host...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}