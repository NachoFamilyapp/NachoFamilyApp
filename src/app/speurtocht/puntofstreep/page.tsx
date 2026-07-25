"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";
import MorseLight from "@/components/morse/MorseLight";
import TeamPicker, {
  getStoredSpeurtochtTeam,
  SpeurtochtTeam,
} from "@/components/speurtocht/TeamPicker";
import UitvoerKeuze, {
  getStoredUitvoer,
  Uitvoer,
} from "@/components/speurtocht/UitvoerKeuze";
import { useUser } from "@/components/UserProvider";

import { LijstUitdagingService } from "@/lib/lijstUitdagingService";
import { PuntStreepService } from "@/lib/puntStreepService";
import { textToFlashSequence } from "@/lib/morse";
import { ontgrendelGeluid } from "@/lib/trainSound";

const SOORT = "puntofstreep";

export default function PuntOfStreepSpelerPage() {
  const router = useRouter();
  const { uid, profile } = useUser();

  const [team, setTeam] = useState(() => getStoredSpeurtochtTeam());
  const [uitvoer, setUitvoer] = useState(() => getStoredUitvoer());

  const [aantalRegels, setAantalRegels] = useState<number | null>(null);
  const [hintFotos, setHintFotos] = useState<string[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  const [regels, setRegels] = useState<string[]>([]);
  const [ingezonden, setIngezonden] = useState(false);
  const [laden, setLaden] = useState(true);
  const [versturen, setVersturen] = useState(false);

  const [huidigWoord, setHuidigWoord] = useState("");
  const [sentAt, setSentAt] = useState(0);
  const [playToken, setPlayToken] = useState(0);

  useEffect(() => {
    if (!uid) return;

    Promise.all([
      LijstUitdagingService.getConfig(SOORT),
      LijstUitdagingService.getEigenInzending(SOORT, uid),
    ]).then(([config, inzending]) => {
      setAantalRegels(config.aantalRegels);
      setHintFotos(config.hintFotos ?? []);

      if (inzending) {
        setRegels(inzending.regels);
        setIngezonden(true);
      } else {
        setRegels(Array.from({ length: config.aantalRegels }, () => ""));
      }

      setLaden(false);
    });
  }, [uid]);

  useEffect(() => {
    if (!uitvoer) return;

    const unsubscribe = PuntStreepService.subscribeToSignaal((signaal) => {
      if (signaal.sentAt !== sentAt && signaal.sentAt > 0) {
        setHuidigWoord(signaal.word);
        setSentAt(signaal.sentAt);
        setPlayToken((t) => t + 1);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uitvoer]);

  const sequence = useMemo(
    () => textToFlashSequence(huidigWoord),
    [huidigWoord]
  );

  function kiesUitvoer(gekozen: Uitvoer) {
    ontgrendelGeluid();
    setUitvoer(gekozen);
  }

  function updateRegel(index: number, waarde: string) {
    setRegels((r) => r.map((v, i) => (i === index ? waarde : v)));
  }

  async function versturenClick() {
    if (!uid || !profile) return;

    setVersturen(true);
    try {
      await LijstUitdagingService.submitRegels(
        SOORT,
        uid,
        profile.name,
        team,
        regels
      );
      setIngezonden(true);
    } finally {
      setVersturen(false);
    }
  }

  if (!team) {
    return <TeamPicker title="Punt of Streep 🔦" onSelect={setTeam} />;
  }

  if (!uitvoer) {
    return <UitvoerKeuze onSelect={kiesUitvoer} />;
  }

  if (laden || aantalRegels === null) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Laden...
      </main>
    );
  }

  if (aantalRegels === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white gap-4 text-center">
        <div className="text-5xl">🔦</div>
        <h1 className="text-2xl font-bold">Punt of Streep</h1>
        <p className="opacity-80">
          Dit onderdeel is nog niet klaar. Vraag de beheerder.
        </p>
        <button onClick={() => router.push("/speurtocht")} className="underline opacity-80">
          ← Terug
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 gap-4 text-white">
      <div className="text-center">
        <div className="text-5xl mb-2">🔦</div>
        <h1 className="text-2xl font-bold">Punt of Streep</h1>
        <p className="opacity-80 text-sm mt-1">
          Wacht tot de beheerder een woord seint, en schrijf op wat je
          waarneemt.
        </p>
      </div>

      <MorseLight
        sequence={sequence}
        playToken={playToken}
        geluidAan={uitvoer === "geluid"}
        verbergLicht={uitvoer === "geluid"}
      />

      {sentAt > 0 && (
        <button
          onClick={() => setPlayToken((t) => t + 1)}
          className="bg-blue-600 active:bg-blue-500 px-5 py-3 rounded-xl font-bold text-sm"
        >
          ▶️ Speel opnieuw af
        </button>
      )}

      <button
        onClick={() => setUitvoer("")}
        className="underline opacity-70 text-sm"
      >
        ⚙️ Wissel tussen licht/geluid
      </button>

      {hintFotos.length > 0 && (
        <button
          onClick={() => {
            setHintIndex(0);
            setHintOpen(true);
          }}
          className="bg-yellow-600 px-5 py-3 rounded-xl font-bold"
        >
          💡 Bekijk hint
        </button>
      )}

      <Card className="w-full max-w-sm text-white">
        <div className="flex flex-col gap-2">
          {regels.map((waarde, i) => (
            <input
              key={i}
              value={waarde}
              onChange={(e) => updateRegel(i, e.target.value)}
              disabled={ingezonden}
              placeholder={`Regel ${i + 1}`}
              className="w-full rounded-xl p-3 text-black bg-white disabled:opacity-60"
            />
          ))}
        </div>

        {ingezonden ? (
          <div className="bg-green-700 rounded-xl p-3 text-center font-bold mt-4">
            ✅ Verstuurd! De beheerder beoordeelt je antwoorden.
          </div>
        ) : (
          <div className="mt-4">
            <BigButton icon="📨" color="green" onClick={versturenClick} disabled={versturen}>
              {versturen ? "Bezig..." : "Versturen"}
            </BigButton>
          </div>
        )}
      </Card>

      <button onClick={() => router.push("/speurtocht")} className="underline opacity-80">
        ← Terug
      </button>

      {hintOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setHintOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hintFotos[hintIndex]}
            alt={`Hint ${hintIndex + 1}`}
            className="max-w-full max-h-[75vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {hintFotos.length > 1 && (
            <div className="flex gap-2 mt-4">
              {hintFotos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHintIndex(i);
                  }}
                  className={`w-3 h-3 rounded-full ${
                    i === hintIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => setHintOpen(false)}
            className="mt-6 bg-white/20 px-6 py-3 rounded-xl font-bold text-white"
          >
            ✕ Sluiten
          </button>
        </div>
      )}
    </main>
  );
}
