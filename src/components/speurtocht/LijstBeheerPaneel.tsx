"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import MorseLight from "@/components/morse/MorseLight";

import { LijstUitdagingService } from "@/lib/lijstUitdagingService";
import { textToFlashSequence } from "@/lib/morse";
import { LijstConfig, LijstInzending, LijstRegelStatus, LijstSoort } from "@/types/lijstUitdaging";

type Props = {
  soort: LijstSoort;
  titel: string;
  toonWoordenLijst?: boolean;
  vasteRegels?: number;
};

export default function LijstBeheerPaneel({
  soort,
  titel,
  toonWoordenLijst,
  vasteRegels,
}: Props) {
  const [config, setConfig] = useState<LijstConfig | null>(null);
  const [inzendingen, setInzendingen] = useState<LijstInzending[]>([]);
  const [woordInput, setWoordInput] = useState("");
  const [flashSequence, setFlashSequence] = useState(textToFlashSequence(""));
  const [playToken, setPlayToken] = useState(0);

  async function laadAlles() {
    const [c, lijst] = await Promise.all([
      LijstUitdagingService.getConfig(soort),
      LijstUitdagingService.getInzendingen(soort),
    ]);
    setConfig(c);
    setInzendingen(lijst);
  }

  useEffect(() => {
    // laadAlles() is async; state-updates gebeuren na een await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    laadAlles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function opslaanAantalRegels(n: number) {
    if (!config) return;
    const next = { ...config, aantalRegels: n };
    setConfig(next);
    await LijstUitdagingService.setConfig(soort, next);
  }

  async function opslaanPuntenPerRegel(n: number) {
    if (!config) return;
    const next = { ...config, puntenPerRegel: n };
    setConfig(next);
    await LijstUitdagingService.setConfig(soort, next);
  }

  async function woordToevoegen() {
    if (!config || !woordInput.trim()) return;
    const woorden = [...(config.woorden ?? []), woordInput.trim().toUpperCase()];
    const next = { ...config, woorden, aantalRegels: woorden.length };
    setConfig(next);
    setWoordInput("");
    await LijstUitdagingService.setConfig(soort, next);
  }

  async function woordVerwijderen(index: number) {
    if (!config) return;
    const woorden = (config.woorden ?? []).filter((_, i) => i !== index);
    const next = { ...config, woorden, aantalRegels: woorden.length };
    setConfig(next);
    await LijstUitdagingService.setConfig(soort, next);
  }

  function flashWoord(woord: string) {
    setFlashSequence(textToFlashSequence(woord));
    setPlayToken((t) => t + 1);
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
    await LijstUitdagingService.setStatus(
      soort,
      inzending.userId,
      inzending.status
    );
    alert("✅ Beoordeling opgeslagen");
  }

  if (!config) {
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
                  className="flex items-center gap-2 bg-white/10 rounded-xl p-3"
                >
                  <span className="flex-1 font-bold">{woord}</span>
                  <button
                    onClick={() => flashWoord(woord)}
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
              ))}
            </div>

            <div className="flex justify-center mb-2">
              <MorseLight sequence={flashSequence} playToken={playToken} />
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

              <button
                onClick={() => opslaanBeoordeling(inzending)}
                className="w-full bg-green-600 rounded-xl p-2 font-bold"
              >
                💾 Beoordeling opslaan
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
