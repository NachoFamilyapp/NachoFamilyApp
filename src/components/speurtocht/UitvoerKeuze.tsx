"use client";

import Card from "@/components/ui/Card";

export type Uitvoer = "licht" | "geluid";

const UITVOER_KEY = "puntofstreep_uitvoer";

export function getStoredUitvoer(): Uitvoer | "" {
  if (typeof window === "undefined") return "";
  const waarde = localStorage.getItem(UITVOER_KEY);
  return waarde === "licht" || waarde === "geluid" ? waarde : "";
}

type Props = {
  onSelect: (uitvoer: Uitvoer) => void;
};

export default function UitvoerKeuze({ onSelect }: Props) {
  function kies(uitvoer: Uitvoer) {
    localStorage.setItem(UITVOER_KEY, uitvoer);
    onSelect(uitvoer);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <Card className="w-full max-w-sm text-white text-center">
        <div className="text-5xl mb-4">🔦🔊</div>
        <h1 className="text-2xl font-bold mb-2">Hoe wil je het signaal ontvangen?</h1>
        <p className="opacity-80 mb-6 text-sm">
          De beheerder seint een woord in morsecode. Kies hoe jij dat wilt
          waarnemen.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => kies("licht")}
            className="bg-blue-600 active:bg-blue-500 p-5 rounded-2xl text-xl font-bold"
          >
            💡 Licht
          </button>

          <button
            onClick={() => kies("geluid")}
            className="bg-yellow-600 active:bg-yellow-500 p-5 rounded-2xl text-xl font-bold"
          >
            🔊 Geluid (treinfluit)
          </button>
        </div>
      </Card>
    </main>
  );
}
