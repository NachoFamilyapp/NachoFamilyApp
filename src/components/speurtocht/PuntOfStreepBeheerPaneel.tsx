"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import MorseLight from "@/components/morse/MorseLight";

import { LijstUitdagingService } from "@/lib/lijstUitdagingService";
import { PuntStreepService } from "@/lib/puntStreepService";
import { textToFlashSequence } from "@/lib/morse";
import { ontgrendelGeluid } from "@/lib/trainSound";
import { compressImageForStorage } from "@/lib/imageUtils";
import {
  LijstConfig,
  LijstInzending,
  LijstRegelStatus,
} from "@/types/lijstUitdaging";

const SOORT = "puntofstreep";

export default function PuntOfStreepBeheerPaneel() {
  const [config, setConfig] = useState<LijstConfig | null>(null);
  const [inzendingen, setInzendingen] = useState<LijstInzending[]>([]);
  const [laden, setLaden] = useState(true);

  const [woordInput, setWoordInput] = useState("");
  const [hintUploading, setHintUploading] = useState(false);

  const [testSequence, setTestSequence] = useState<ReturnType<typeof textToFlashSequence>>([]);
  const [testToken, setTestToken] = useState(0);
  const [versturen, setVersturen] = useState(false);
  const [verstuurd, setVerstuurd] = useState<string | null>(null);

  useEffect(() => {
    let actief = true;

    async function laadAlles() {
      try {
        const [c, lijst] = await Promise.all([
          LijstUitdagingService.getConfig(SOORT),
          LijstUitdagingService.getInzendingen(SOORT),
        ]);

        if (!actief) return;

        setConfig(c);
        setInzendingen(lijst);
      } catch (error) {
        console.error("Kon Punt of Streep-gegevens niet laden:", error);
      } finally {
        if (actief) setLaden(false);
      }
    }

    laadAlles();

    return () => {
      actief = false;
    };
  }, []);

  async function herlaadInzendingen() {
    try {
      const lijst = await LijstUitdagingService.getInzendingen(SOORT);
      setInzendingen(lijst);
    } catch (error) {
      console.error(error);
    }
  }

  async function opslaanConfig(next: LijstConfig) {
    setConfig(next);
    try {
      await LijstUitdagingService.setConfig(SOORT, next);
    } catch (error) {
      console.error(error);
      alert("Opslaan mislukt. Probeer het nog eens.");
    }
  }

  function opslaanPuntenPerRegel(n: number) {
    if (!config) return;
    opslaanConfig({ ...config, puntenPerRegel: Math.max(1, n) });
  }

  function woordToevoegen() {
    if (!config || !woordInput.trim()) return;
    const woorden = [...(config.woorden ?? []), woordInput.trim().toUpperCase()];
    opslaanConfig({ ...config, woorden, aantalRegels: woorden.length });
    setWoordInput("");
  }

  function woordVerwijderen(index: number) {
    if (!config) return;
    const woorden = (config.woorden ?? []).filter((_, i) => i !== index);
    opslaanConfig({ ...config, woorden, aantalRegels: woorden.length });
  }

  function testHier(woord: string) {
    ontgrendelGeluid();
    setTestSequence(textToFlashSequence(woord));
    setTestToken((t) => t + 1);
  }

  async function verstuurNaarSpelers(woord: string) {
    setVersturen(true);
    try {
      await PuntStreepService.stuurSignaal(woord);
      setVerstuurd(woord);
      setTimeout(() => setVerstuurd(null), 2500);
    } catch (error) {
      console.error(error);
      alert("Versturen naar spelers mislukt.");
    } finally {
      setVersturen(false);
    }
  }

  async function hintFotoToevoegen(file: File) {
    if (!config) return;

    setHintUploading(true);
    try {
      const { dataUrl, withinLimit } = await compressImageForStorage(file);

      if (!withinLimit) {
        alert("❌ Deze foto is te groot/gedetailleerd. Kies een andere foto.");
        return;
      }

      const hintFotos = [...(config.hintFotos ?? []), dataUrl];
      await opslaanConfig({ ...config, hintFotos });
    } catch (error) {
      console.error(error);
      alert("Foto uploaden mislukt.");
    } finally {
      setHintUploading(false);
    }
  }

  function hintFotoVerwijderen(index: number) {
    if (!config) return;
    const hintFotos = (config.hintFotos ?? []).filter((_, i) => i !== index);
    opslaanConfig({ ...config, hintFotos });
  }

  function zetStatus(
    inzending: LijstInzending,
    lineIndex: number,
    status: LijstRegelStatus
  ) {
    const nieuweStatus = inzending.status.map((v, i) =>
      i === lineIndex ? (v === status ? "onbeoordeeld" : status) : v
    );

    setInzendingen((list) =>
      list.map((i) =>
        i.userId === inzending.userId ? { ...i, status: nieuweStatus } : i
      )
    );
  }

  async function opslaanBeoordeling(inzending: LijstInzending) {
    try {
      await LijstUitdagingService.setStatus(SOORT, inzending.userId, inzending.status);
      alert("✅ Beoordeling opgeslagen");
    } catch (error) {
      console.error(error);
      alert("Opslaan van beoordeling mislukt.");
    }
  }

  async function verwijderInzending(inzending: LijstInzending) {
    if (
      !confirm(
        `Inzending van ${inzending.userName} (${inzending.team}) verwijderen?`
      )
    ) {
      return;
    }

    try {
      await LijstUitdagingService.deleteInzending(SOORT, inzending.userId);
      await herlaadInzendingen();
    } catch (error) {
      console.error(error);
      alert("Verwijderen mislukt.");
    }
  }

  if (laden || !config) {
    return <p className="text-center opacity-80 py-10">Laden...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="text-white">
        <h2 className="text-xl font-bold mb-2">🔦 Punt of Streep</h2>
        <p className="opacity-80 text-sm mb-3">
          Voeg woorden toe. Als je op &quot;📡 Verstuur naar spelers&quot;
          tikt, ontvangt elke speler het woord op zijn eigen telefoon — als
          licht of als geluid, afhankelijk van wat de speler zelf koos.
        </p>

        <div className="flex gap-2 mb-3">
          <input
            value={woordInput}
            onChange={(e) => setWoordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && woordToevoegen()}
            placeholder="Nieuw woord"
            className="flex-1 rounded-xl p-3 text-black bg-white"
          />
          <button
            onClick={woordToevoegen}
            className="bg-green-600 rounded-xl px-4 font-bold"
          >
            ➕
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {(config.woorden ?? []).map((woord, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-2 bg-white/10 rounded-xl p-3"
            >
              <span className="flex-1 font-bold">{woord}</span>

              <button
                onClick={() => testHier(woord)}
                className="bg-white/20 px-3 py-2 rounded-lg font-bold text-sm"
              >
                🔊 Test hier
              </button>

              <button
                onClick={() => verstuurNaarSpelers(woord)}
                disabled={versturen}
                className="bg-blue-600 disabled:bg-gray-500 px-3 py-2 rounded-lg font-bold text-sm"
              >
                📡 Verstuur naar spelers
              </button>

              <button
                onClick={() => woordVerwijderen(i)}
                className="bg-red-700 px-3 py-2 rounded-lg font-bold"
              >
                🗑️
              </button>

              {verstuurd === woord && (
                <span className="text-green-300 text-sm font-bold w-full">
                  ✅ Verstuurd naar alle spelers!
                </span>
              )}
            </div>
          ))}

          {(config.woorden ?? []).length === 0 && (
            <p className="opacity-70 text-sm">Nog geen woorden toegevoegd.</p>
          )}
        </div>

        <div className="flex justify-center mb-2">
          <MorseLight sequence={testSequence} playToken={testToken} geluidAan />
        </div>
        <p className="text-xs opacity-70 text-center">
          &quot;Test hier&quot; speelt alleen op jouw eigen scherm af, om te
          controleren. &quot;Verstuur naar spelers&quot; stuurt het woord
          naar iedereen.
        </p>

        <div className="mt-4">
          <label className="block font-bold mb-1">Punten per goedgekeurd woord</label>
          <input
            type="number"
            min={1}
            value={config.puntenPerRegel}
            onChange={(e) => opslaanPuntenPerRegel(Number(e.target.value) || 1)}
            className="w-full rounded-xl p-3 text-black bg-white"
          />
        </div>
      </Card>

      <Card className="text-white">
        <h3 className="text-lg font-bold mb-2">💡 Hint-foto&apos;s voor spelers</h3>
        <p className="opacity-80 text-sm mb-3">
          Spelers kunnen deze foto&apos;s bekijken als hulpje.
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {(config.hintFotos ?? []).map((foto, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={foto}
                alt={`Hint ${i + 1}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                onClick={() => hintFotoVerwijderen(i)}
                className="absolute -top-2 -right-2 bg-red-700 rounded-full w-6 h-6 text-sm font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <label className="block">
          <span className="block bg-blue-600 rounded-xl p-3 text-center font-bold cursor-pointer">
            {hintUploading ? "Bezig..." : "📷 Hint-foto toevoegen"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={hintUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) hintFotoToevoegen(file);
              e.target.value = "";
            }}
          />
        </label>
      </Card>

      <Card className="text-white">
        <h3 className="text-lg font-bold mb-3">
          🗂️ Inzendingen ({inzendingen.length})
        </h3>

        {inzendingen.length === 0 && (
          <p className="opacity-70">Nog geen inzendingen.</p>
        )}

        <div className="flex flex-col gap-4">
          {inzendingen.map((inzending) => (
            <div key={inzending.userId} className="bg-white/10 rounded-xl p-3">
              <div className="font-bold mb-2">
                {inzending.userName} ({inzending.team}) ·{" "}
                {inzending.status.filter((s) => s === "goedgekeurd").length} van{" "}
                {inzending.regels.length} goedgekeurd
              </div>

              <div className="flex flex-col gap-1 mb-3">
                {inzending.regels.map((regel, i) => {
                  const status = inzending.status[i] ?? "onbeoordeeld";

                  return (
                    <div key={i} className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                      <span className="flex-1">
                        {regel || <em className="opacity-50">leeg</em>}
                      </span>

                      <button
                        onClick={() => zetStatus(inzending, i, "goedgekeurd")}
                        className={`px-3 py-2 rounded-lg font-bold ${
                          status === "goedgekeurd" ? "bg-green-600" : "bg-white/20"
                        }`}
                      >
                        ✅
                      </button>

                      <button
                        onClick={() => zetStatus(inzending, i, "afgekeurd")}
                        className={`px-3 py-2 rounded-lg font-bold ${
                          status === "afgekeurd" ? "bg-red-600" : "bg-white/20"
                        }`}
                      >
                        ❌
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => opslaanBeoordeling(inzending)}
                  className="flex-1 bg-green-600 rounded-xl p-2 font-bold"
                >
                  💾 Beoordeling opslaan
                </button>

                <button
                  onClick={() => verwijderInzending(inzending)}
                  className="bg-red-700 rounded-xl px-4 font-bold"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
