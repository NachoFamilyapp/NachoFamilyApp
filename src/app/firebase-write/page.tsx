"use client";

import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function FirebaseWritePage() {
  const createGame = async () => {
    await setDoc(
      doc(db, "games", "1234"),
      {
        gameName: "Capture The Flag",
        players: 4,
        teams: 2,
      }
    );

    alert("Game opgeslagen");
  };

  return (
    <main className="min-h-screen bg-green-900 text-white p-8">
      <h1 className="text-4xl mb-6">
        Firebase Write Test
      </h1>

      <button
        onClick={createGame}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        Maak Test Game
      </button>
    </main>
  );
}