"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import {
  SLAGHAREN_ATTRACTIES,
  categorieVoorLengte,
  TOEGANG_LABELS,
  ToegangCategorie,
} from "@/config/slagharenAttracties";

export default function KaartPage() {
  const router = useRouter();

  const [lengte, setLengte] = useState(120);
  const [showFoto, setShowFoto] = useState(false);

  const gesorteerd = [...SLAGHAREN_ATTRACTIES].sort((a, b) => {
    const orde: Record<ToegangCategorie, number> = {
      rood: 0,
      blauw: 1,
      oranje: 2,
      groen: 3,
    };
    const catA = categorieVoorLengte(a, lengte);
    const catB = categorieVoorLengte(b, lengte);
    return orde[catA] - orde[catB];
  });

  return (
    <main className="min-h-screen text-white p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">🗺️</div>
          <h1 className="text-3xl font-bold">Kaart & Toegankelijkheid</h1>
          <p className="opacity-80 mt-1">
            Vul de lengte van je kind in en zie meteen bij welke attracties
            ze wel of niet mogen.
          </p>
        </div>

        <Card className="text-white">
          <label className="block font-bold mb-2 text-center">
            Lengte: {lengte} cm
          </label>
          <input
            type="range"
            min={60}
            max={200}
            value={lengte}
            onChange={(e) => setLengte(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex flex-wrap gap-2 mt-4 justify-center text-sm">
            {(Object.keys(TOEGANG_LABELS) as ToegangCategorie[]).map((cat) => (
              <div
                key={cat}
                className={`${TOEGANG_LABELS[cat].kleur} px-3 py-1 rounded-full font-bold`}
              >
                {TOEGANG_LABELS[cat].emoji} {TOEGANG_LABELS[cat].label}
              </div>
            ))}
          </div>
        </Card>

        <Card className="text-white">
          <div className="flex flex-col gap-2">
            {gesorteerd.map((attractie, index) => {
              const cat = categorieVoorLengte(attractie, lengte);
              const info = TOEGANG_LABELS[cat];

              return (
                <div
                  key={`${attractie.nummer}-${index}`}
                  className="flex items-center gap-3 bg-white/10 rounded-xl p-3"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
                    {attractie.nummer}
                  </div>
                  <div className="flex-1 font-bold">{attractie.naam}</div>
                  <div
                    className={`${info.kleur} px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap`}
                  >
                    {info.emoji} {info.label}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <button
          onClick={() => setShowFoto((v) => !v)}
          className="bg-white/20 rounded-xl p-3 font-bold"
        >
          {showFoto ? "🔽 Verberg originele lengtetabel" : "📷 Bekijk originele lengtetabel"}
        </button>

        {showFoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/slagharen/lengtetabel.jpg"
            alt="Officiële Slagharen lengtetabel"
            className="w-full rounded-xl"
          />
        )}

        <button
          onClick={() => router.push("/")}
          className="underline opacity-80 mx-auto mt-2"
        >
          🏠 Terug naar Home
        </button>
      </div>
    </main>
  );
}
