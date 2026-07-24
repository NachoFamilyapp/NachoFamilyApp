"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import MorseLight from "@/components/morse/MorseLight";

import { LijstUitdagingService } from "@/lib/lijstUitdagingService";
import { textToFlashSequence } from "@/lib/morse";
import { ontgrendelGeluid } from "@/lib/trainSound";
import { compressImageForStorage } from "@/lib/imageUtils";
import {
  LijstConfig,
  LijstInzending,
  LijstRegelStatus,
  LijstSoort,
} from "@/types/lijstUitdaging";

type Props = {
  soort: LijstSoort;
  titel: string;
  toonWoordenLijst?: boolean;
  toonHintKnop?: boolean;
  vasteRegels?: number;
};

export default function LijstBeheerPaneel({
  soort,
  titel,
  toonWoordenLijst,
  toonHintKnop,
  vasteRegels,
}: Props) {
  const [config, setConfig] = useState<LijstConfig | null>(null);
  const [inzendingen, setInzendingen] = useState<LijstInzending[]>([]);
  const [laden, setLaden] = useState(true);

  const [woordInput, setWoordInput] = useState("");
  const [flashSequence, setFlashSequence] = useState<ReturnType<typeof textToFlashSequence>>([]);
  const [playToken, setPlayToken] = useState(0);
  const [geluidAan, setGeluidAan] = useState(false);
  const [verbergTijdensSeinen, setVerbergTijdensSeinen] = useState(true);
  const [seinendIndex, setSeinendIndex] = useState<number | null>(null);

  const [hintUploading, setHintUploading] = useState(false);

  useEffect(() => {
    let actief = true;

    async function laadAlles() {
      try {
        const [c, lijst] = await Promise.all([
          LijstUitdagingService.getConfig(soort),
          LijstUitdagingService.getInzendingen(soort),
        ]);

        if (!actief) return;

        setConfig(c);
        setInzendingen(lijst);
      } catch (error) {
        console.error("Kon Punt of Streep / Herinner-gegevens niet laden:", error);
      } finally {
        if (actief) setLaden(false);
      }
    }

    laadAlles();

    return () => {
      actief = false;
    };
  }, [soort]);

  async function herlaadInzendingen() {
    try {
      const lijst = await LijstUitdagingService.getInzendingen(soort);
      setInzendingen(lijst);
    } catch (error) {
      console.error(error);
    }
  }

  async function opslaanConfig(next: LijstConfig) {
    setConfig(next);
    try {
      await LijstUitdagingService.setConfig(soort, next);
    } catch (error) {
      console.error(error);
      alert("Opslaan mislukt. Probeer het nog eens.");
    }
  }

  function opslaanAantalRegels(n: number) {
    if (!config) return;
    opslaanConfig({ ...config, aantalRegels: Math.max(1, n) });
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

  function flashWoord(woord: string, index: number) {
    ontgrendelGeluid();
    setSeinendIndex(index);
    setFlashSequence(textToFlashSequence(woord));
    setPlayToken((t) => t + 1);
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
      await LijstUitdagingService.setStatus(
        soort,
        inzending.userId,
        inzending.status
      );
      alert("✅ Beoordeling opgeslagen");
    } catch (error) {
      console.error(error);
      alert("Opslaan van beoordeling mislukt.");
    }
  }

  async function verwijderInzending(inzending: LijstInzending) {
    if (
      !confirm(
        `Inzending van ${inzending.userName} (${inzending.team}) verwijderen? Dit kan niet ongedaan gemaakt worden.`
      )
    ) {
      return;
    }

    try {
      await LijstUitdagingService.deleteInzending(soort, inzending.userId);
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
        <h2 className="text-xl font-bold mb-3">{titel}</h2>

        {toonWoordenLijst ? (
          <>
            <p className="opacity-80 text-sm mb-3">
              Voeg de woorden toe die je in morsecode gaat seinen. Het
              aantal regels voor spelers volgt automatisch uit het aantal
              woorden.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <button
                onClick={() => setVerbergTijdensSeinen((v) => !v)}
                className={`flex-1 p-3 rounded-xl font-bold ${
                  verbergTijdensSeinen ? "bg-green-600" : "bg-white/20"
                }`}
              >
                {verbergTijdensSeinen ? "🙈" : "👁️"} Verberg woord tijdens seinen
              </button>

              <button
                onClick={() => setGeluidAan((v) => !v)}
                className={`flex-1 p-3 rounded-xl font-bold ${
                  geluidAan ? "bg-green-600" : "bg-white/20"
                }`}
              >
                {geluidAan ? "🔊" : "🔇"} Treingeluid bij seinen
              </button>
            </div>

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
              {(config.woorden ?? []).map((woord, i) => {
                const wordtVerborgen =
                  verbergTijdensSeinen && seinendIndex === i && playToken > 0;

                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/10 rounded-xl p-3"
                  >
                    <span className="flex-1 font-bold tracking-widest">
                      {wordtVerborgen ? "🙈 " + "●".repeat(woord.length) : woord}
                    </span>
                    <button
                      onClick={() => flashWoord(woord, i)}
                      className="bg-blue-600 px-3 py-2 rounded-lg font-bold"
                    >
                      💡 Flash
                    </button>
                    <button
                      onClick={() => woordVerwijderen(i)}
                      className="bg-red-700 px-3 py-2 rounded-lg font-bold"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mb-2">
              <MorseLight
                sequence={flashSequence}
                playToken={playToken}
                geluidAan={geluidAan}
                onDone={() => setSeinendIndex(null)}
              />
            </div>
            <p className="text-xs opacity-70 text-center">
              Dit is jouw eigen scherm — houd &apos;m omhoog zodat spelers
              het licht kunnen zien. Een woord mag je zo vaak opnieuw
              flashen als je wilt.
            </p>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <label className="block font-bold mb-1">
                Aantal regels voor spelers
              </label>
              <input
                type="number"
                min={1}
                value={vasteRegels ?? config.aantalRegels}
                disabled={!!vasteRegels}
                onChange={(e) => opslaanAantalRegels(Number(e.target.value) || 1)}
                className="w-full rounded-xl p-3 text-black bg-white disabled:opacity-60"
              />
            </div>
          </div>
        )}

        <div className="mt-3">
          <label className="block font-bold mb-1">Punten per goedgekeurde regel</label>
          <input
            type="number"
            min={1}
            value={config.puntenPerRegel}
            onChange={(e) => opslaanPuntenPerRegel(Number(e.target.value) || 1)}
            className="w-full rounded-xl p-3 text-black bg-white"
          />
        </div>
      </Card>

      {toonHintKnop && (
        <Card className="text-white">
          <h3 className="text-lg font-bold mb-2">💡 Hint-foto&apos;s voor spelers</h3>
          <p className="opacity-80 text-sm mb-3">
            Spelers kunnen deze foto&apos;s bekijken als hulpje. Je kunt er
            meerdere toevoegen.
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
      )}

      <Card className="text-white">
        <h3 className="text-lg font-bold mb-3">
          🗂️ Inzendingen ({inzendingen.length})
        </h3>

        {inzendingen.length === 0 && (
          <p className="opacity-70">Nog geen inzendingen.</p>
        )}

        <div className="flex flex-col gap-4">
          {inzendingen.map((inzending) => (
            <div
              key={inzending.userId}
              className="bg-white/10 rounded-xl p-3"
            >
              <div className="font-bold mb-2">
                {inzending.userName} ({inzending.team}) ·{" "}
                {inzending.status.filter((s) => s === "goedgekeurd").length}{" "}
                van {inzending.regels.length} goedgekeurd
              </div>

              <div className="flex flex-col gap-1 mb-3">
                {inzending.regels.map((regel, i) => {
                  const status = inzending.status[i] ?? "onbeoordeeld";

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white/10 rounded-lg p-2"
                    >
                      <span className="flex-1">
                        {regel || <em className="opacity-50">leeg</em>}
                      </span>

                      <button
                        onClick={() => zetStatus(inzending, i, "goedgekeurd")}
                        className={`px-3 py-2 rounded-lg font-bold ${
                          status === "goedgekeurd"
                            ? "bg-green-600"
                            : "bg-white/20"
                        }`}
                      >
                        ✅
                      </button>

                      <button
                        onClick={() => zetStatus(inzending, i, "afgekeurd")}
                        className={`px-3 py-2 rounded-lg font-bold ${
                          status === "afgekeurd"
                            ? "bg-red-600"
                            : "bg-white/20"
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
