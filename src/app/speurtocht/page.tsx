"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";
import { SpeurtochtService } from "@/lib/speurtochtService";
import { OnderdelenSettings } from "@/types/speurtocht";

export default function SpeurtochtHomePage() {
  const router = useRouter();

  const [onderdelen, setOnderdelen] = useState<OnderdelenSettings | null>(
    null
  );
  const [scores, setScores] = useState<{ rood: number; blauw: number } | null>(
    null
  );

  useEffect(() => {
    SpeurtochtService.getOnderdelenSettings().then(setOnderdelen);

    Promise.all([
      SpeurtochtService.getTeamScore("Rood team"),
      SpeurtochtService.getTeamScore("Blauw team"),
    ]).then(([rood, blauw]) => setScores({ rood, blauw }));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 text-white">

      <div className="text-center">
        <div className="text-6xl mb-2">🧭</div>
        <h1 className="text-4xl font-bold">Speurtocht</h1>
        <p className="opacity-90 mt-2">
          Volg het kompas, los de puzzels op!
        </p>
      </div>

      {scores && (scores.rood > 0 || scores.blauw > 0) && (
        <Card className="w-full max-w-sm text-white text-center">
          <div className="text-sm opacity-80 mb-2">🏆 Tussenstand</div>
          <div className="flex justify-center gap-6 text-xl font-bold">
            <div>🔴 {scores.rood}</div>
            <div>🔵 {scores.blauw}</div>
          </div>
        </Card>
      )}

      <Card className="w-full max-w-sm flex flex-col gap-4 text-white">

        {onderdelen?.kompas && (
          <BigButton
            icon="🧭"
            color="blue"
            onClick={() => router.push("/speurtocht/kompas")}
          >
            Onderdeel 1: Speurtocht
          </BigButton>
        )}

        {onderdelen?.foto && (
          <BigButton
            icon="📸"
            color="yellow"
            onClick={() => router.push("/speurtocht/foto")}
          >
            Onderdeel 2: Waar ben ik?
          </BigButton>
        )}

        {onderdelen && !onderdelen.kompas && !onderdelen.foto && (
          <p className="text-center opacity-80">
            Er is nog geen onderdeel gestart. Vraag de beheerder!
          </p>
        )}

        <BigButton
          icon="🔒"
          color="purple"
          onClick={() => router.push("/speurtocht/beheer")}
        >
          Beheer
        </BigButton>

      </Card>

      <button
        onClick={() => router.push("/")}
        className="underline opacity-80 mt-2"
      >
        🏠 Terug naar Home
      </button>

    </main>
  );
}
