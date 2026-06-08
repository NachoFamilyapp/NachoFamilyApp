"use client";

import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeamSelectPage() {
  const router = useRouter();

  const selectTeam = async (
    team: string
  ) => {
    const playerName =
      localStorage.getItem(
        "playerName"
      ) || "";

    const gameCode =
      localStorage.getItem(
        "gameCode"
      ) || "";

    if (
      !playerName ||
      !gameCode
    ) {
      alert(
        "Speler of game niet gevonden"
      );
      return;
    }

    const gameRef = doc(
      db,
      "games",
      gameCode
    );

    const gameSnap =
      await getDoc(gameRef);

    if (!gameSnap.exists()) {
      alert(
        "Game bestaat niet"
      );
      return;
    }

    const data =
      gameSnap.data();

    const updatedPlayers =
      (data.players || []).map(
        (player: any) =>
          player.name ===
          playerName
            ? {
                ...player,
                team,
              }
            : player
      );

    await updateDoc(
      gameRef,
      {
        players:
          updatedPlayers,
      }
    );

    localStorage.setItem(
      "team",
      team
    );

    router.push("/game");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Kies je Team
      </h1>

      <div className="flex gap-6">
        <button
          onClick={() =>
            selectTeam(
              "red"
            )
          }
          className="bg-red-600 px-10 py-6 rounded-xl text-2xl"
        >
          Team Rood
        </button>

        <button
          onClick={() =>
            selectTeam(
              "blue"
            )
          }
          className="bg-blue-600 px-10 py-6 rounded-xl text-2xl"
        >
          Team Blauw
        </button>
      </div>
    </main>
  );
}