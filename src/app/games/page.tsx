"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHuidigeGebruiker } from "@/lib/useHuidigeGebruiker";
import { heeftToegang } from "@/types/account";
import { Zoekspel } from "@/types/zoekspel";

// Standaard-objectenlijst overgenomen van het Sinterklaas-zoekspel-poster.
const SINT_PIET_OBJECTEN = [
  { naam: "Rood paraplu", emoji: "☂️" },
  { naam: "Gele eend", emoji: "🦆" },
  { naam: "Voetbal", emoji: "⚽" },
  { naam: "Verrekijker", emoji: "🔭" },
  { naam: "Sleutel", emoji: "🔑" },
  { naam: "Vlinder", emoji: "🦋" },
  { naam: "Wortel", emoji: "🥕" },
  { naam: "Kroon", emoji: "👑" },
  { naam: "Snoepstok", emoji: "🍬" },
  { naam: "Fototoestel", emoji: "📷" },
  { naam: "Brief", emoji: "✉️" },
  { naam: "Verfpenseel", emoji: "🖌️" },
  { naam: "Vissenkom", emoji: "🐠" },
  { naam: "Wekker", emoji: "⏰" },
  { naam: "Lantaarn", emoji: "🏮" },
  { naam: "Schoen", emoji: "👞" },
  { naam: "Treintje", emoji: "🚂" },
  { naam: "Walkie talkie", emoji: "📻" },
  { naam: "Zaklamp", emoji: "🔦" },
  { naam: "Slijmer", emoji: "🐌" },
];

export default function GamesPage() {
  const router = useRouter();
  const { gebruiker, rechten, laden: gebruikerLaden } = useHuidigeGebruiker();

  const [spellen, setSpellen] = useState<Zoekspel[]>([]);
  const [laden, setLaden] = useState(true);
  const [aanmaakBezig, setAanmaakBezig] = useState(false);

  const magLezen = heeftToegang(rechten["games"], "lezen");
  const magSchrijven = heeftToegang(rechten["games"], "schrijven");

  async function laadSpellen() {
    setLaden(true);
    try {
      const response = await fetch("/api/games/zoekspel");
      const data = await response.json();
      setSpellen(data.spellen ?? []);
    } finally {
      setLaden(false);
    }
  }

  useEffect(() => {
    if (!gebruikerLaden && gebruiker && magLezen) {
      // laadSpellen() is async; state-update gebeurt na een await.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      laadSpellen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gebruikerLaden, gebruiker, magLezen]);

  async function voorbeeldToevoegen() {
    setAanmaakBezig(true);
    try {
      await fetch("/api/games/zoekspel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titel: "Sint & Piet: Zoek de voorwerpen",
          afbeelding: "/games/sinterklaas-zoekspel.jpg",
          objecten: SINT_PIET_OBJECTEN,
        }),
      });
      await laadSpellen();
    } finally {
      setAanmaakBezig(false);
    }
  }

  if (gebruikerLaden || laden) {
    return <main className="min-h-screen flex items-center justify-center">Laden...</main>;
  }

  if (!gebruiker) {
    router.push("/login");
    return null;
  }

  if (!magLezen) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-4 text-center">
        <div className="text-5xl">🔒</div>
        <p>Je hebt geen toegang tot Games.</p>
        <button onClick={() => router.push("/")} className="underline opacity-80">
          ← Terug naar Home
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="text-center mb-2">
          <div className="text-6xl mb-2">🎮</div>
          <h1 className="text-3xl font-bold">Games</h1>
        </div>

        {spellen.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center">
            <p className="opacity-80 mb-4">Er zijn nog geen spellen.</p>
            {magSchrijven && (
              <button
                onClick={voorbeeldToevoegen}
                disabled={aanmaakBezig}
                className="bg-green-600 disabled:bg-gray-500 rounded-xl px-6 py-3 font-bold"
              >
                {aanmaakBezig ? "Bezig..." : "🎅 Sint & Piet zoekspel toevoegen"}
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {spellen.map((spel) => (
            <button
              key={spel.id}
              onClick={() => router.push(`/games/zoekspel/${spel.id}`)}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden text-left flex items-center gap-4 hover:bg-white/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={spel.afbeelding}
                alt={spel.titel}
                className="w-24 h-24 object-cover"
              />
              <div className="flex-1 p-2">
                <div className="font-bold text-lg">{spel.titel}</div>
                <div className="opacity-70 text-sm">
                  🔍 Zoek {spel.aantalObjecten} voorwerpen
                </div>
              </div>
            </button>
          ))}
        </div>

        {magSchrijven && spellen.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {spellen.map((spel) => (
              <button
                key={spel.id}
                onClick={() => router.push(`/games/zoekspel/${spel.id}/instellen`)}
                className="bg-white/10 rounded-xl p-3 text-sm font-bold text-left"
              >
                📍 Locaties instellen: {spel.titel}
              </button>
            ))}
          </div>
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
