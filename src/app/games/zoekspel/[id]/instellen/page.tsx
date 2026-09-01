"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ZoekObject } from "@/types/zoekspel";

export default function LocatiesInstellenPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [objecten, setObjecten] = useState<ZoekObject[]>([]);
  const [afbeelding, setAfbeelding] = useState("");
  const [actieveIndex, setActieveIndex] = useState<number | null>(null);
  const [laden, setLaden] = useState(true);
  const [opslaanBezig, setOpslaanBezig] = useState(false);
  const afbeeldingRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function laad() {
      const [locatiesResponse, spelResponse] = await Promise.all([
        fetch(`/api/games/zoekspel/${id}/locaties`),
        fetch(`/api/games/zoekspel/${id}`),
      ]);

      const locatiesData = await locatiesResponse.json();
      const spelData = await spelResponse.json();

      if (locatiesResponse.ok) setObjecten(locatiesData.objecten ?? []);
      if (spelResponse.ok) setAfbeelding(spelData.spel?.afbeelding ?? "");

      setLaden(false);
    }

    laad();
  }, [id]);

  function afbeeldingGeklikt(event: React.MouseEvent<HTMLImageElement>) {
    if (actieveIndex === null || !afbeeldingRef.current) return;

    const rect = afbeeldingRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setObjecten((prev) =>
      prev.map((object, i) =>
        i === actieveIndex ? { ...object, x, y, ingesteld: true } : object
      )
    );
    setActieveIndex(null);
  }

  async function opslaan() {
    setOpslaanBezig(true);
    try {
      await fetch(`/api/games/zoekspel/${id}/locaties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objecten }),
      });
      alert("✅ Locaties opgeslagen!");
    } finally {
      setOpslaanBezig(false);
    }
  }

  if (laden) {
    return <main className="min-h-screen flex items-center justify-center">Laden...</main>;
  }

  const aantalIngesteld = objecten.filter((o) => o.ingesteld).length;

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <div className="text-center">
          <div className="text-4xl mb-1">📍</div>
          <h1 className="text-2xl font-bold">Locaties instellen</h1>
          <p className="opacity-80 text-sm mt-1">
            Tik op een voorwerp in de lijst, tik daarna op de plek in de
            afbeelding waar het staat. {aantalIngesteld} / {objecten.length} ingesteld.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {objecten.map((object, i) => (
            <button
              key={i}
              onClick={() => setActieveIndex(i)}
              className={`px-3 py-2 rounded-lg text-sm font-bold ${
                actieveIndex === i
                  ? "bg-yellow-500 ring-2 ring-white"
                  : object.ingesteld
                    ? "bg-green-700"
                    : "bg-white/20"
              }`}
            >
              {object.emoji} {object.naam} {object.ingesteld ? "✅" : ""}
            </button>
          ))}
        </div>

        {actieveIndex !== null && (
          <p className="text-center text-yellow-300 font-bold">
            Tik nu op de afbeelding waar &quot;{objecten[actieveIndex].naam}&quot; te
            zien is.
          </p>
        )}

        <div className="relative w-full select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={afbeeldingRef}
            src={afbeelding}
            alt="Zoekspel"
            onClick={afbeeldingGeklikt}
            className={`w-full rounded-xl ${actieveIndex !== null ? "cursor-crosshair" : ""}`}
          />

          {objecten.map((object, i) =>
            object.ingesteld ? (
              <div
                key={i}
                className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs"
                style={{ left: `${object.x}%`, top: `${object.y}%` }}
                title={object.naam}
              >
                {object.emoji}
              </div>
            ) : null
          )}
        </div>

        <button
          onClick={opslaan}
          disabled={opslaanBezig}
          className="w-full bg-green-600 disabled:bg-gray-500 rounded-xl p-3 font-bold"
        >
          {opslaanBezig ? "Bezig..." : "💾 Locaties opslaan"}
        </button>

        <button
          onClick={() => router.push("/games")}
          className="underline opacity-80 mx-auto"
        >
          ← Terug naar Games
        </button>
      </div>
    </main>
  );
}
