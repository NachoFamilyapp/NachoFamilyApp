"use client";

import Card from "@/components/ui/Card";

export const SPEURTOCHT_TEAM_KEY = "speurtocht_team";

export type SpeurtochtTeam = "Rood team" | "Blauw team";

export function getStoredSpeurtochtTeam(): SpeurtochtTeam | "" {
  if (typeof window === "undefined") return "";
  const value = localStorage.getItem(SPEURTOCHT_TEAM_KEY);
  return value === "Rood team" || value === "Blauw team" ? value : "";
}

type Props = {
  title: string;
  onSelect: (team: SpeurtochtTeam) => void;
};

export default function TeamPicker({ title, onSelect }: Props) {
  function choose(team: SpeurtochtTeam) {
    localStorage.setItem(SPEURTOCHT_TEAM_KEY, team);
    onSelect(team);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <Card className="w-full max-w-sm text-white text-center">
        <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
        <h1 className="text-2xl font-bold mb-6">{title}</h1>

        <p className="opacity-90 mb-4">In welk team zit je?</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => choose("Rood team")}
            className="bg-red-600 active:bg-red-500 p-5 rounded-2xl text-xl font-bold"
          >
            🔴 Rood team
          </button>

          <button
            onClick={() => choose("Blauw team")}
            className="bg-blue-600 active:bg-blue-500 p-5 rounded-2xl text-xl font-bold"
          >
            🔵 Blauw team
          </button>
        </div>
      </Card>
    </main>
  );
}
