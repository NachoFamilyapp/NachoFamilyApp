"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import TeamPicker, {
  getStoredSpeurtochtTeam,
  SpeurtochtTeam,
} from "@/components/speurtocht/TeamPicker";

import { SpeurtochtService } from "@/lib/speurtochtService";
import { compressImageFile } from "@/lib/imageUtils";
import { FotoUitdaging, FotoInzending } from "@/types/speurtocht";

export default function WaarBenIkPage() {
  const router = useRouter();

  const [active, setActive] = useState<boolean | null>(null);
  const [uitdagingen, setUitdagingen] = useState<FotoUitdaging[]>([]);
  const [mineSubmissions, setMineSubmissions] = useState<FotoInzending[]>([]);
  const [team, setTeam] = useState(() => getStoredSpeurtochtTeam());
  const [score, setScore] = useState(0);

  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh(teamName: string) {
    const [settings, list, all] = await Promise.all([
      SpeurtochtService.getOnderdelenSettings(),
      SpeurtochtService.getUitdagingen(),
      SpeurtochtService.getInzendingen(),
    ]);

    setActive(settings.foto);
    setUitdagingen(list);
    setMineSubmissions(all.filter((s) => s.playerName === teamName));

    const teamScore = await SpeurtochtService.getPlayerScore(teamName);
    setScore(teamScore);
  }

  useEffect(() => {
    if (team) {
      // refresh() is async; state-updates gebeuren na een await.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refresh(team);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chooseTeam(chosen: SpeurtochtTeam) {
    setTeam(chosen);
    refresh(chosen);
  }

  async function submitPhoto(challengeId: string, file: File) {
    setBusyId(challengeId);
    try {
      const compressed = await compressImageFile(file, 900, 0.6);

      await SpeurtochtService.submitInzending({
        challengeId,
        playerName: team,
        photoImage: compressed,
      });

      await refresh(team);
      alert("📸 Foto ingestuurd! De beheerder beoordeelt 'm zo.");
    } catch (error) {
      console.error(error);
      alert("Versturen mislukt, probeer opnieuw.");
    } finally {
      setBusyId(null);
    }
  }

  if (!team) {
    return <TeamPicker title="Waar ben ik? 📸" onSelect={chooseTeam} />;
  }

  if (active === false) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-white p-6 text-center gap-4">
        <div className="text-5xl">🚧</div>
        <p className="text-xl font-bold">Dit onderdeel is nog niet gestart.</p>
        <p className="opacity-80">Vraag de beheerder om het te openen.</p>
        <button onClick={() => router.push("/speurtocht")} className="underline opacity-80">
          ← Terug
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 text-white gap-4">
      <div className="text-center">
        <div className="text-5xl mb-2">📸</div>
        <h1 className="text-2xl font-bold">Waar ben ik?</h1>
        <p className="opacity-80">
          {team} · score: 🏆 {score} punten
        </p>
      </div>

      {uitdagingen.length === 0 && (
        <p className="opacity-70">Er zijn nog geen uitdagingen.</p>
      )}

      {uitdagingen.map((u) => {
        const mySubmissionsForThis = mineSubmissions.filter(
          (s) => s.challengeId === u.id
        );
        const approved = mySubmissionsForThis.some((s) => s.status === "approved");
        const pending = mySubmissionsForThis.some((s) => s.status === "pending");

        return (
          <Card key={u.id} className="text-white w-full max-w-sm">
            <div className="font-bold text-lg mb-1">{u.title}</div>
            {u.hint && <div className="text-sm opacity-80 mb-2">💡 {u.hint}</div>}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={u.referenceImage}
              alt={u.title}
              className="w-full rounded-xl mb-3 max-h-56 object-cover"
            />

            {approved ? (
              <div className="bg-green-700 rounded-xl p-3 text-center font-bold">
                ✅ Match goedgekeurd! +{u.points} punt(en)
              </div>
            ) : pending ? (
              <div className="bg-yellow-700 rounded-xl p-3 text-center font-bold">
                ⏳ Wordt beoordeeld...
              </div>
            ) : (
              <label className="block">
                <span className="block bg-blue-600 rounded-xl p-3 text-center font-bold cursor-pointer">
                  {busyId === u.id ? "Bezig..." : "📷 Maak een foto"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  disabled={busyId === u.id}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) submitPhoto(u.id, file);
                  }}
                />
              </label>
            )}
          </Card>
        );
      })}

      <button onClick={() => router.push("/speurtocht")} className="underline opacity-80 mt-2">
        ← Terug
      </button>
    </main>
  );
}
