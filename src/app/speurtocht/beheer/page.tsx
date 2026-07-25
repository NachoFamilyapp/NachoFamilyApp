"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";
import PasswordGate from "@/components/PasswordGate";

import { SpeurtochtService } from "@/lib/speurtochtService";
import { compressImageForStorage } from "@/lib/imageUtils";
import { DEFAULT_KOMPAS_SPEURTOCHT } from "@/config/speurtochtDefault";

import {
  KompasSpeurtocht,
  SpeurtochtCheckpoint,
  FotoUitdaging,
  FotoInzending,
  OnderdelenSettings,
} from "@/types/speurtocht";

import LijstBeheerPaneel from "@/components/speurtocht/LijstBeheerPaneel";
import PuntOfStreepBeheerPaneel from "@/components/speurtocht/PuntOfStreepBeheerPaneel";

const KompasMapPicker = dynamic(
  () => import("@/components/speurtocht/KompasMapPicker"),
  { ssr: false }
);

const ADMIN_CODE = "5712";

type Tab =
  | "onderdelen"
  | "kompas"
  | "fotospel"
  | "inzendingen"
  | "herinner"
  | "puntofstreep"
  | "geheimschrift";

export default function SpeurtochtBeheerPage() {
  return (
    <PasswordGate
      code={ADMIN_CODE}
      sessionKey="speurtocht_admin_ok"
      title="Beheer Speurtocht"
      backHref="/speurtocht"
    >
      <BeheerPanel />
    </PasswordGate>
  );
}

function BeheerPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("onderdelen");

  return (
    <main className="min-h-screen text-white">
      <nav className="bg-black/30 backdrop-blur-sm border-b border-white/20 p-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => router.push("/speurtocht")}
          className="bg-white/20 px-4 py-2 rounded-xl font-bold"
        >
          ← Speurtocht
        </button>

        <button
          onClick={() => setTab("onderdelen")}
          className={`px-4 py-2 rounded-xl font-bold ${tab === "onderdelen" ? "bg-green-600" : "bg-green-900"}`}
        >
          👁️ Onderdelen
        </button>

        <button
          onClick={() => setTab("kompas")}
          className={`px-4 py-2 rounded-xl font-bold ${tab === "kompas" ? "bg-blue-600" : "bg-blue-900"}`}
        >
          🧭 Speurtocht
        </button>

        <button
          onClick={() => setTab("fotospel")}
          className={`px-4 py-2 rounded-xl font-bold ${tab === "fotospel" ? "bg-yellow-600" : "bg-yellow-900"}`}
        >
          📸 Waar ben ik?
        </button>

        <button
          onClick={() => setTab("herinner")}
          className={`px-4 py-2 rounded-xl font-bold ${tab === "herinner" ? "bg-teal-600" : "bg-teal-900"}`}
        >
          🧠 Herinner de objecten
        </button>

        <button
          onClick={() => setTab("puntofstreep")}
          className={`px-4 py-2 rounded-xl font-bold ${tab === "puntofstreep" ? "bg-orange-600" : "bg-orange-900"}`}
        >
          🔦 Punt of Streep
        </button>

        <button
          onClick={() => setTab("geheimschrift")}
          className={`px-4 py-2 rounded-xl font-bold ${tab === "geheimschrift" ? "bg-pink-600" : "bg-pink-900"}`}
        >
          📜 Geheimschrift
        </button>

        <button
          onClick={() => setTab("inzendingen")}
          className={`px-4 py-2 rounded-xl font-bold ${tab === "inzendingen" ? "bg-purple-600" : "bg-purple-900"}`}
        >
          🗂️ Inzendingen Waar ben ik?
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {tab === "onderdelen" && <OnderdelenTab />}
        {tab === "kompas" && <KompasTab />}
        {tab === "fotospel" && <FotospelTab />}
        {tab === "inzendingen" && <InzendingenTab />}
        {tab === "herinner" && (
          <LijstBeheerPaneel soort="herinner" titel="🧠 Herinner de objecten" />
        )}
        {tab === "puntofstreep" && <PuntOfStreepBeheerPaneel />}
        {tab === "geheimschrift" && (
          <LijstBeheerPaneel
            soort="geheimschrift"
            titel="📜 Geheimschrift"
            vasteRegels={1}
            toonHintKnop
          />
        )}
      </div>
    </main>
  );
}

function OnderdelenTab() {
  const [settings, setSettings] = useState<OnderdelenSettings | null>(null);

  useEffect(() => {
    // getOnderdelenSettings() is async; state-update gebeurt na een await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    SpeurtochtService.getOnderdelenSettings().then(setSettings);
  }, []);

  async function toggle(key: keyof OnderdelenSettings) {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await SpeurtochtService.setOnderdeelActive(key, next[key]);
  }

  if (!settings) {
    return <p className="text-center opacity-80 py-10">Laden...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="text-white">
        <h2 className="text-xl font-bold mb-2">👁️ Wat zien spelers nu?</h2>
        <p className="opacity-80 text-sm mb-4">
          Zet hier per onderdeel aan of uit wat spelers op dit moment op de
          Speurtocht-startpagina zien. Zo kun je het park in fases spelen.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => toggle("kompas")}
            className={`w-full p-4 rounded-xl text-lg font-bold text-left ${
              settings.kompas ? "bg-green-600" : "bg-red-700"
            }`}
          >
            {settings.kompas ? "✅" : "❌"} 🧭 Speurtocht
          </button>

          <button
            onClick={() => toggle("foto")}
            className={`w-full p-4 rounded-xl text-lg font-bold text-left ${
              settings.foto ? "bg-green-600" : "bg-red-700"
            }`}
          >
            {settings.foto ? "✅" : "❌"} 📸 Waar ben ik?
          </button>

          <button
            onClick={() => toggle("herinner")}
            className={`w-full p-4 rounded-xl text-lg font-bold text-left ${
              settings.herinner ? "bg-green-600" : "bg-red-700"
            }`}
          >
            {settings.herinner ? "✅" : "❌"} 🧠 Herinner de objecten
          </button>

          <button
            onClick={() => toggle("puntofstreep")}
            className={`w-full p-4 rounded-xl text-lg font-bold text-left ${
              settings.puntofstreep ? "bg-green-600" : "bg-red-700"
            }`}
          >
            {settings.puntofstreep ? "✅" : "❌"} 🔦 Punt of Streep
          </button>

          <button
            onClick={() => toggle("geheimschrift")}
            className={`w-full p-4 rounded-xl text-lg font-bold text-left ${
              settings.geheimschrift ? "bg-green-600" : "bg-red-700"
            }`}
          >
            {settings.geheimschrift ? "✅" : "❌"} 📜 Geheimschrift
          </button>
        </div>
      </Card>
    </div>
  );
}

function KompasTab() {
  const [hunt, setHunt] = useState<KompasSpeurtocht | null>(null);
  const [saving, setSaving] = useState(false);
  const [locatingId, setLocatingId] = useState<string | null>(null);

  useEffect(() => {
    SpeurtochtService.getKompasSpeurtocht().then(setHunt);
  }, []);

  if (!hunt) {
    return <p className="text-center opacity-80 py-10">Laden...</p>;
  }

  function updateCheckpoint(
    id: string,
    changes: Partial<SpeurtochtCheckpoint>
  ) {
    setHunt((prev) =>
      prev
        ? {
            ...prev,
            checkpoints: prev.checkpoints.map((cp) =>
              cp.id === id ? { ...cp, ...changes } : cp
            ),
          }
        : prev
    );
  }

  function fetchCurrentLocation(id: string) {
    setLocatingId(id);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateCheckpoint(id, {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocatingId(null);
      },
      () => {
        alert("Kon locatie niet ophalen. Sta locatietoegang toe.");
        setLocatingId(null);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function save() {
    if (!hunt) return;
    setSaving(true);
    try {
      await SpeurtochtService.saveKompasSpeurtocht(hunt);
      alert("✅ Speurtocht opgeslagen");
    } catch (error) {
      console.error(error);
      alert("Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  function resetToDefault() {
    if (confirm("Terug naar de standaard Slagharen-speurtocht? Je eigen wijzigingen gaan verloren (tot je weer opslaat).")) {
      setHunt(DEFAULT_KOMPAS_SPEURTOCHT);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="text-white">
        <label className="block font-bold mb-1">Titel</label>
        <input
          value={hunt.title}
          onChange={(e) => setHunt({ ...hunt, title: e.target.value })}
          className="w-full rounded-xl p-3 text-black bg-white mb-3"
        />

        <label className="block font-bold mb-1">Introductietekst</label>
        <textarea
          value={hunt.intro}
          onChange={(e) => setHunt({ ...hunt, intro: e.target.value })}
          className="w-full rounded-xl p-3 text-black bg-white mb-1"
          rows={2}
        />
      </Card>

      <Card className="text-white">
        <h3 className="text-lg font-bold mb-3">🗺️ Locaties op de kaart zetten</h3>
        <KompasMapPicker
          checkpoints={hunt.checkpoints}
          centerLat={hunt.startLat}
          centerLng={hunt.startLng}
          onSetLocation={(id, lat, lng) => updateCheckpoint(id, { lat, lng })}
        />
      </Card>

      {hunt.checkpoints.map((cp, index) => (
        <Card key={cp.id} className="text-white">
          <h3 className="text-xl font-bold mb-3">
            {cp.emoji} Opdracht {index + 1} — {cp.targetName || "..."}
          </h3>

          <label className="block text-sm font-bold mb-1 opacity-90">
            Naam van de attractie
          </label>
          <input
            value={cp.targetName}
            onChange={(e) =>
              updateCheckpoint(cp.id, { targetName: e.target.value })
            }
            className="w-full rounded-xl p-3 text-black bg-white mb-3"
          />

          <label className="block text-sm font-bold mb-1 opacity-90">
            Vraag
          </label>
          <textarea
            value={cp.question}
            onChange={(e) =>
              updateCheckpoint(cp.id, { question: e.target.value })
            }
            className="w-full rounded-xl p-3 text-black bg-white mb-3"
            rows={2}
          />

          <label className="block text-sm font-bold mb-1 opacity-90">
            Antwoordopties (kies het juiste antwoord)
          </label>
          <div className="flex flex-col gap-2 mb-3">
            {cp.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={cp.correctIndex === optionIndex}
                  onChange={() =>
                    updateCheckpoint(cp.id, { correctIndex: optionIndex })
                  }
                />
                <input
                  value={option}
                  onChange={(e) => {
                    const options = [...cp.options];
                    options[optionIndex] = e.target.value;
                    updateCheckpoint(cp.id, { options });
                  }}
                  className="flex-1 rounded-xl p-2 text-black bg-white"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-bold mb-1 opacity-90">
                Letter bij goed antwoord
              </label>
              <input
                value={cp.letter}
                maxLength={1}
                onChange={(e) =>
                  updateCheckpoint(cp.id, {
                    letter: e.target.value.toUpperCase(),
                  })
                }
                className="w-full rounded-xl p-3 text-black bg-white text-center text-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1 opacity-90">
                Aankomstafstand (meter)
              </label>
              <input
                type="number"
                value={cp.radius}
                onChange={(e) =>
                  updateCheckpoint(cp.id, {
                    radius: Number(e.target.value) || 25,
                  })
                }
                className="w-full rounded-xl p-3 text-black bg-white text-center"
              />
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-sm font-bold mb-2">📍 Locatie van deze attractie</div>

            {cp.lat && cp.lng ? (
              <div className="text-sm opacity-90 mb-2">
                ✅ Ingesteld ({cp.lat.toFixed(5)}, {cp.lng.toFixed(5)})
              </div>
            ) : (
              <div className="text-sm text-yellow-300 mb-2">
                ⚠️ Nog niet ingesteld
              </div>
            )}

            <button
              onClick={() => fetchCurrentLocation(cp.id)}
              disabled={locatingId === cp.id}
              className="w-full bg-blue-600 disabled:bg-gray-500 rounded-xl p-3 font-bold"
            >
              {locatingId === cp.id
                ? "📡 Locatie ophalen..."
                : "📍 Sta bij de attractie? Gebruik huidige locatie"}
            </button>

            <p className="text-xs opacity-70 mt-2">
              Tip: gebruik hierboven de kaart om vanaf een afstand te
              plaatsen, of ga zelf naar {cp.targetName || "de attractie"} toe
              en tik op de knop hierboven voor het exacte punt.
            </p>
          </div>
        </Card>
      ))}

      <Card className="text-white">
        <label className="block font-bold mb-1">Het geheime woord</label>
        <input
          value={hunt.finalWord}
          onChange={(e) =>
            setHunt({ ...hunt, finalWord: e.target.value.toUpperCase() })
          }
          className="w-full rounded-xl p-3 text-black bg-white mb-3 text-center text-2xl font-bold tracking-widest"
        />

        <label className="block font-bold mb-1">Eindboodschap</label>
        <textarea
          value={hunt.finalMessage}
          onChange={(e) => setHunt({ ...hunt, finalMessage: e.target.value })}
          className="w-full rounded-xl p-3 text-black bg-white"
          rows={2}
        />
      </Card>

      <BigButton icon="💾" color="green" onClick={save} disabled={saving}>
        {saving ? "Opslaan..." : "Speurtocht Opslaan"}
      </BigButton>

      <button
        onClick={resetToDefault}
        className="underline opacity-70 text-sm mx-auto"
      >
        Terugzetten naar standaard Slagharen-speurtocht
      </button>
    </div>
  );
}

function FotospelTab() {
  const [uitdagingen, setUitdagingen] = useState<FotoUitdaging[]>([]);
  const [title, setTitle] = useState("");
  const [hint, setHint] = useState("");
  const [points, setPoints] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    const list = await SpeurtochtService.getUitdagingen();
    setUitdagingen(list);
  }

  useEffect(() => {
    // refresh() is async; het state-bijwerken gebeurt na een await, niet synchroon.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function handleFile(file: File) {
    try {
      const { dataUrl, withinLimit } = await compressImageForStorage(file);

      if (!withinLimit) {
        alert(
          "❌ Deze foto is te groot/gedetailleerd, zelfs na comprimeren. " +
            "Kies een eenvoudigere of kleinere foto."
        );
        return;
      }

      setImagePreview(dataUrl);
    } catch (error) {
      console.error(error);
      alert("Foto laden mislukt");
    }
  }

  async function addChallenge() {
    if (!title.trim() || !imagePreview) {
      alert("Vul een titel in en kies een foto");
      return;
    }

    setUploading(true);
    try {
      await SpeurtochtService.addUitdaging({
        title: title.trim(),
        hint: hint.trim(),
        referenceImage: imagePreview,
        points,
      });

      setTitle("");
      setHint("");
      setPoints(1);
      setImagePreview(null);
      await refresh();
    } catch (error) {
      console.error(error);
      alert("Opslaan mislukt (foto mogelijk te groot)");
    } finally {
      setUploading(false);
    }
  }

  async function removeChallenge(id: string) {
    if (!confirm("Deze uitdaging verwijderen?")) return;
    await SpeurtochtService.deleteUitdaging(id);
    await refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="text-white">
        <h2 className="text-xl font-bold mb-2">📸 Waar ben ik?</h2>
        <p className="opacity-80 text-sm mb-4">
          Zet ingezoomde foto&apos;s van plekken in het park. Spelers zoeken
          de plek en maken zelf een foto die erop lijkt. Ga naar het
          tabblad &quot;👁️ Onderdelen&quot; om dit onderdeel zichtbaar te
          maken voor spelers.
        </p>
      </Card>

      <Card className="text-white">
        <h3 className="text-lg font-bold mb-3">➕ Nieuwe uitdaging</h3>

        <label className="block text-sm font-bold mb-1 opacity-90">
          Titel / naam van de plek
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl p-3 text-black bg-white mb-3"
          placeholder="Bijv. De saloon-deur"
        />

        <label className="block text-sm font-bold mb-1 opacity-90">
          Hint (optioneel)
        </label>
        <input
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          className="w-full rounded-xl p-3 text-black bg-white mb-3"
          placeholder="Bijv. Ergens bij het Wilde Westen plein"
        />

        <label className="block text-sm font-bold mb-1 opacity-90">
          Punten bij goede match
        </label>
        <input
          type="number"
          min={1}
          value={points}
          onChange={(e) => setPoints(Number(e.target.value) || 1)}
          className="w-full rounded-xl p-3 text-black bg-white mb-3"
        />

        <label className="block text-sm font-bold mb-1 opacity-90">
          Ingezoomde foto
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="w-full text-sm mb-3"
        />

        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview}
            alt="Voorbeeld"
            className="w-full rounded-xl mb-3 max-h-48 object-cover"
          />
        )}

        <BigButton
          icon="➕"
          color="yellow"
          onClick={addChallenge}
          disabled={uploading}
        >
          {uploading ? "Bezig..." : "Uitdaging toevoegen"}
        </BigButton>
      </Card>

      {uitdagingen.map((u) => (
        <Card key={u.id} className="text-white">
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={u.referenceImage}
              alt={u.title}
              className="w-24 h-24 object-cover rounded-xl"
            />
            <div className="flex-1">
              <div className="font-bold text-lg">{u.title}</div>
              {u.hint && <div className="text-sm opacity-80">{u.hint}</div>}
              <div className="text-sm opacity-80">🏆 {u.points} punt(en)</div>
            </div>
          </div>
          <button
            onClick={() => removeChallenge(u.id)}
            className="w-full bg-red-700 rounded-xl p-2 mt-3 font-bold"
          >
            🗑️ Verwijderen
          </button>
        </Card>
      ))}
    </div>
  );
}

function InzendingenTab() {
  const [inzendingen, setInzendingen] = useState<FotoInzending[]>([]);
  const [uitdagingen, setUitdagingen] = useState<FotoUitdaging[]>([]);

  async function refresh() {
    const [i, u] = await Promise.all([
      SpeurtochtService.getInzendingen(),
      SpeurtochtService.getUitdagingen(),
    ]);
    setInzendingen(i);
    setUitdagingen(u);
  }

  useEffect(() => {
    // refresh() is async; het state-bijwerken gebeurt na een await, niet synchroon.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function review(id: string, status: "approved" | "rejected") {
    await SpeurtochtService.reviewInzending(id, status);
    await refresh();
  }

  function challengeTitle(challengeId: string) {
    return uitdagingen.find((u) => u.id === challengeId)?.title ?? "?";
  }

  const pending = inzendingen.filter((i) => i.status === "pending");
  const reviewed = inzendingen.filter((i) => i.status !== "pending");

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">
        🗂️ Inzendingen ({pending.length} wachtend)
      </h2>

      {pending.length === 0 && (
        <p className="opacity-70">Geen inzendingen om te beoordelen.</p>
      )}

      {pending.map((i) => (
        <Card key={i.id} className="text-white">
          <div className="font-bold mb-1">
            {i.userName} ({i.team}) — {challengeTitle(i.challengeId)}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={i.photoImage}
            alt="Inzending"
            className="w-full rounded-xl mb-3 max-h-64 object-cover"
          />
          <div className="flex gap-3">
            <button
              onClick={() => review(i.id, "approved")}
              className="flex-1 bg-green-600 rounded-xl p-3 font-bold"
            >
              ✅ Goedkeuren
            </button>
            <button
              onClick={() => review(i.id, "rejected")}
              className="flex-1 bg-red-600 rounded-xl p-3 font-bold"
            >
              ❌ Afkeuren
            </button>
          </div>
        </Card>
      ))}

      {reviewed.length > 0 && (
        <>
          <h3 className="text-lg font-bold mt-4 opacity-80">Eerder beoordeeld</h3>
          {reviewed.map((i) => (
            <div
              key={i.id}
              className="bg-black/30 rounded-xl p-3 flex justify-between items-center"
            >
              <span>
                {i.userName} ({i.team}) — {challengeTitle(i.challengeId)}
              </span>
              <span>
                {i.status === "approved" ? "✅" : "❌"}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
