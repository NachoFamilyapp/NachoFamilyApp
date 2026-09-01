"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHuidigeGebruiker } from "@/lib/useHuidigeGebruiker";
import { heeftToegang } from "@/types/account";
import { Zoekspel, ZoekspelVoortgang } from "@/types/zoekspel";

function formatTijd(seconden: number): string {
  const min = Math.floor(seconden / 60);
  const sec = seconden % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function ZoekspelSpelenPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { gebruiker, rechten, laden: gebruikerLaden } = useHuidigeGebruiker();

  const [spel, setSpel] = useState<Zoekspel | null>(null);
  const [voortgang, setVoortgang] = useState<ZoekspelVoortgang | null>(null);
  const [scores, setScores] = useState<ZoekspelVoortgang[]>([]);
  const [laden, setLaden] = useState(true);
  const [verlopenTijd, setVerlopenTijd] = useState(0);
  const [feedback, setFeedback] = useState<{ tekst: string; goed: boolean } | null>(null);
  const [tikBezig, setTikBezig] = useState(false);

  const afbeeldingRef = useRef<HTMLImageElement>(null);
  const magSpelen = heeftToegang(rechten["games"], "lezen");

  async function laadSpel() {
    setLaden(true);
    try {
      const response = await fetch(`/api/games/zoekspel/${id}`);
      const data = await response.json();

      if (response.ok) {
        setSpel(data.spel);
        setVoortgang(data.voortgang);
      }
    } finally {
      setLaden(false);
    }
  }

  useEffect(() => {
    if (!gebruikerLaden && gebruiker && magSpelen) {
      // laadSpel() is async; state-update gebeurt na een await.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      laadSpel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gebruikerLaden, gebruiker, magSpelen]);

  // Live tellende klok terwijl het spel bezig is
  useEffect(() => {
    if (!voortgang || voortgang.voltooidOp) return;

    const interval = setInterval(() => {
      setVerlopenTijd(Math.floor((Date.now() - voortgang.gestartOp) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [voortgang]);

  useEffect(() => {
    if (voortgang?.voltooidOp) {
      fetch(`/api/games/zoekspel/${id}/scores`)
        .then((r) => r.json())
        .then((data) => setScores(data.scores ?? []));
    }
  }, [voortgang?.voltooidOp, id]);

  async function spelStarten() {
    const response = await fetch(`/api/games/zoekspel/${id}/start`, { method: "POST" });
    const data = await response.json();
    if (response.ok) {
      setVoortgang(data.voortgang);
      setVerlopenTijd(0);
    }
  }

  async function afbeeldingGeklikt(event: React.MouseEvent<HTMLImageElement>) {
    if (!afbeeldingRef.current || !voortgang || voortgang.voltooidOp || tikBezig) return;

    const rect = afbeeldingRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setTikBezig(true);
    try {
      const response = await fetch(`/api/games/zoekspel/${id}/tap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y }),
      });

      const data = await response.json();
      if (!response.ok) return;

      setVoortgang(data.voortgang);

      if (data.gevonden) {
        setFeedback({ tekst: `✅ ${data.object.emoji} ${data.object.naam} gevonden!`, goed: true });
      } else {
        setFeedback({ tekst: "❌ Niets hier...", goed: false });
      }

      setTimeout(() => setFeedback(null), 1200);
    } finally {
      setTikBezig(false);
    }
  }

  if (gebruikerLaden || laden) {
    return <main className="min-h-screen flex items-center justify-center">Laden...</main>;
  }

  if (!gebruiker) {
    router.push("/login");
    return null;
  }

  if (!magSpelen || !spel) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-4 text-center">
        <div className="text-5xl">🔒</div>
        <p>Je hebt geen toegang tot dit spel.</p>
        <button onClick={() => router.push("/games")} className="underline opacity-80">
          ← Terug naar Games
        </button>
      </main>
    );
  }

  // Nog niet gestart
  if (!voortgang) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-4 text-center">
        <div className="text-5xl mb-2">🔍</div>
        <h1 className="text-2xl font-bold">{spel.titel}</h1>
        <p className="opacity-80 max-w-sm">
          Zoek alle {spel.aantalObjecten} voorwerpen zo snel mogelijk. De klok
          start zodra je op &quot;Start!&quot; drukt.
        </p>

        <div className="flex flex-wrap gap-2 justify-center max-w-md">
          {spel.objecten.map((object, i) => (
            <span key={i} className="bg-white/10 rounded-lg px-3 py-1 text-sm">
              {object.emoji} {object.naam}
            </span>
          ))}
        </div>

        <button
          onClick={spelStarten}
          className="bg-green-600 active:bg-green-500 px-8 py-4 rounded-2xl text-xl font-bold mt-2"
        >
          ▶️ Start!
        </button>

        <button onClick={() => router.push("/games")} className="underline opacity-80">
          ← Terug naar Games
        </button>
      </main>
    );
  }

  const voltooid = Boolean(voortgang.voltooidOp);
  const aantalGevonden = voortgang.gevondenIndices.length;

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{spel.titel}</h1>
          <div className="text-2xl font-black bg-white/10 rounded-xl px-4 py-1">
            ⏱️ {formatTijd(voltooid ? voortgang.tijdInSeconden ?? 0 : verlopenTijd)}
          </div>
        </div>

        <div className="text-center opacity-80">
          {aantalGevonden} / {spel.aantalObjecten} gevonden
        </div>

        {feedback && (
          <p
            className={`text-center font-bold ${feedback.goed ? "text-green-300" : "text-red-300"}`}
          >
            {feedback.tekst}
          </p>
        )}

        <div className="relative w-full select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={afbeeldingRef}
            src={spel.afbeelding}
            alt={spel.titel}
            onClick={afbeeldingGeklikt}
            className={`w-full rounded-xl ${voltooid ? "" : "cursor-crosshair"}`}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {spel.objecten.map((object, i) => {
            const gevonden = voortgang.gevondenIndices.includes(i);
            return (
              <span
                key={i}
                className={`rounded-lg px-3 py-1 text-sm ${
                  gevonden ? "bg-green-700 line-through opacity-70" : "bg-white/10"
                }`}
              >
                {object.emoji} {object.naam}
              </span>
            );
          })}
        </div>

        {voltooid && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center mt-2">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-xl font-bold mb-4">
              Klaar in {formatTijd(voortgang.tijdInSeconden ?? 0)}!
            </p>

            {scores.length > 0 && (
              <div className="mb-4">
                <h2 className="font-bold mb-2">🏆 Snelste tijden</h2>
                <div className="flex flex-col gap-1">
                  {scores.map((score, i) => (
                    <div
                      key={score.userId}
                      className="flex justify-between bg-white/10 rounded-lg px-3 py-2 text-sm"
                    >
                      <span>
                        {i + 1}. {score.userName}
                      </span>
                      <span className="font-bold">
                        {formatTijd(score.tijdInSeconden ?? 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={spelStarten}
              className="bg-blue-600 active:bg-blue-500 px-6 py-3 rounded-xl font-bold"
            >
              🔄 Opnieuw spelen
            </button>
          </div>
        )}

        <button
          onClick={() => router.push("/games")}
          className="underline opacity-80 mx-auto mt-2"
        >
          ← Terug naar Games
        </button>
      </div>
    </main>
  );
}
