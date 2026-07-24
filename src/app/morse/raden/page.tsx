"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import MorseLight from "@/components/morse/MorseLight";

import { textToFlashSequence } from "@/lib/morse";
import { MORSE_WOORDEN, randomWoorden } from "@/config/morseWoorden";

function nieuweRonde() {
  const woord = MORSE_WOORDEN[Math.floor(Math.random() * MORSE_WOORDEN.length)];
  const opties = [...randomWoorden(3, woord), woord].sort(() => Math.random() - 0.5);
  return { woord, opties };
}

export default function MorseRadenPage() {
  const router = useRouter();

  const [ronde, setRonde] = useState(() => nieuweRonde());
  const [playToken, setPlayToken] = useState(0);
  const [gekozen, setGekozen] = useState<string | null>(null);
  const [score, setScore] = useState({ goed: 0, fout: 0 });

  const sequence = useMemo(
    () => textToFlashSequence(ronde.woord),
    [ronde.woord]
  );

  function speelAf() {
    setPlayToken((t) => t + 1);
  }

  function kies(optie: string) {
    if (gekozen) return;
    setGekozen(optie);

    if (optie === ronde.woord) {
      setScore((s) => ({ ...s, goed: s.goed + 1 }));
    } else {
      setScore((s) => ({ ...s, fout: s.fout + 1 }));
    }
  }

  function volgende() {
    setRonde(nieuweRonde());
    setGekozen(null);
    setPlayToken(0);
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 gap-6 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">🔤 Raad het woord</h1>
        <p className="opacity-80 text-sm mt-1">
          ✅ {score.goed} · ❌ {score.fout}
        </p>
      </div>

      <MorseLight sequence={sequence} playToken={playToken} />

      <button
        onClick={speelAf}
        className="bg-blue-600 active:bg-blue-500 px-6 py-4 rounded-2xl text-xl font-bold"
      >
        ▶️ {playToken === 0 ? "Speel het signaal af" : "Speel opnieuw af"}
      </button>

      <Card className="w-full max-w-sm text-white">
        <h2 className="font-bold text-lg mb-3 text-center">
          Welk woord werd geseind?
        </h2>

        <div className="flex flex-col gap-2">
          {ronde.opties.map((optie) => {
            const isCorrect = optie === ronde.woord;
            const isChosen = optie === gekozen;

            let kleur = "bg-blue-600";
            if (gekozen) {
              if (isCorrect) kleur = "bg-green-600";
              else if (isChosen) kleur = "bg-red-600";
              else kleur = "bg-gray-600 opacity-60";
            }

            return (
              <button
                key={optie}
                onClick={() => kies(optie)}
                disabled={!!gekozen}
                className={`p-4 rounded-xl font-bold text-lg ${kleur}`}
              >
                {optie}
              </button>
            );
          })}
        </div>

        {gekozen && (
          <button
            onClick={volgende}
            className="w-full bg-yellow-600 rounded-xl p-3 font-bold mt-4"
          >
            ➡️ Volgend woord
          </button>
        )}
      </Card>

      <button
        onClick={() => router.push("/morse")}
        className="underline opacity-80"
      >
        ← Terug
      </button>
    </main>
  );
}
