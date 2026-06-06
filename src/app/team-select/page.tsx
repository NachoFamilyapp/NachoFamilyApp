"use client";

import { useRouter } from "next/navigation";

export default function TeamSelectPage() {
  const router = useRouter();

  const selectTeam = (team: string) => {
    localStorage.setItem("team", team);
    router.push("/game");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Kies je Team
      </h1>

      <div className="flex gap-6">
        <button
          onClick={() => selectTeam("Rood")}
          className="bg-red-600 px-10 py-6 rounded-xl text-2xl"
        >
          Team Rood
        </button>

        <button
          onClick={() => selectTeam("Blauw")}
          className="bg-blue-600 px-10 py-6 rounded-xl text-2xl"
        >
          Team Blauw
        </button>
      </div>
    </main>
  );
}