"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHuidigeGebruiker } from "@/lib/useHuidigeGebruiker";
import { MODULES, PermissieNiveau, Account } from "@/types/account";

export default function BeheerPage() {
  const router = useRouter();
  const { gebruiker, laden } = useHuidigeGebruiker();

  const [ontgrendeld, setOntgrendeld] = useState(false);

  useEffect(() => {
    if (!laden && (!gebruiker || !gebruiker.isAdmin)) {
      router.push("/");
    }
  }, [laden, gebruiker, router]);

  if (laden || !gebruiker) {
    return <main className="min-h-screen flex items-center justify-center">Laden...</main>;
  }

  if (!gebruiker.isAdmin) {
    return null;
  }

  if (!ontgrendeld) {
    return <BeheerVergrendelScherm onOntgrendeld={() => setOntgrendeld(true)} />;
  }

  return <BeheerPaneel />;
}

function BeheerVergrendelScherm({ onOntgrendeld }: { onOntgrendeld: () => void }) {
  const router = useRouter();
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);

  async function ontgrendelen() {
    setFout("");
    setBezig(true);
    try {
      const response = await fetch("/api/admin/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wachtwoord }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFout(data.error ?? "Onjuist wachtwoord.");
        return;
      }

      onOntgrendeld();
    } finally {
      setBezig(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-2">Beheer</h1>
        <p className="opacity-80 mb-4 text-sm">
          Voer het Beheer-wachtwoord in. Nog geen wachtwoord ingesteld? Typ
          er dan gewoon eentje in — die wordt meteen je nieuwe Beheer-wachtwoord.
        </p>

        <input
          type="password"
          value={wachtwoord}
          onChange={(e) => setWachtwoord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ontgrendelen()}
          className="w-full rounded-xl p-3 text-black bg-white mb-4 text-center text-xl"
          placeholder="••••••"
        />

        {fout && <p className="text-red-300 text-sm mb-4">{fout}</p>}

        <button
          onClick={ontgrendelen}
          disabled={bezig}
          className="w-full bg-purple-600 disabled:bg-gray-500 rounded-xl p-3 font-bold mb-3"
        >
          {bezig ? "Bezig..." : "🔓 Ontgrendelen"}
        </button>

        <button onClick={() => router.push("/")} className="underline opacity-70 text-sm">
          ← Terug naar Home
        </button>
      </div>
    </main>
  );
}

function BeheerPaneel() {
  const router = useRouter();
  const [gebruikers, setGebruikers] = useState<Account[]>([]);
  const [rechtenPerGebruiker, setRechtenPerGebruiker] = useState<
    Record<string, Record<string, PermissieNiveau>>
  >({});
  const [laden, setLaden] = useState(true);

  const [nieuweUsername, setNieuweUsername] = useState("");
  const [nieuweDisplayName, setNieuweDisplayName] = useState("");
  const [nieuwWachtwoord, setNieuwWachtwoord] = useState("");
  const [nieuweIsAdmin, setNieuweIsAdmin] = useState(false);
  const [aanmakenBezig, setAanmakenBezig] = useState(false);
  const [aanmakenFout, setAanmakenFout] = useState("");

  const [nieuwBeheerWachtwoord, setNieuwBeheerWachtwoord] = useState("");
  const [beheerWachtwoordMelding, setBeheerWachtwoordMelding] = useState("");

  async function laadGebruikers() {
    setLaden(true);
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setGebruikers(data.gebruikers ?? []);
    } finally {
      setLaden(false);
    }
  }

  useEffect(() => {
    // laadGebruikers() is async; state-update gebeurt na een await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    laadGebruikers();
  }, []);

  async function gebruikerAanmaken() {
    setAanmakenFout("");

    if (!nieuweUsername.trim() || !nieuweDisplayName.trim() || !nieuwWachtwoord.trim()) {
      setAanmakenFout("Vul alle velden in.");
      return;
    }

    setAanmakenBezig(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: nieuweUsername,
          displayName: nieuweDisplayName,
          wachtwoord: nieuwWachtwoord,
          isAdmin: nieuweIsAdmin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAanmakenFout(data.error ?? "Aanmaken mislukt.");
        return;
      }

      setNieuweUsername("");
      setNieuweDisplayName("");
      setNieuwWachtwoord("");
      setNieuweIsAdmin(false);
      await laadGebruikers();
    } finally {
      setAanmakenBezig(false);
    }
  }

  async function gebruikerVerwijderen(uid: string, naam: string) {
    if (!confirm(`Gebruiker "${naam}" verwijderen?`)) return;

    await fetch("/api/admin/users/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });

    await laadGebruikers();
  }

  async function wachtwoordResetten(uid: string) {
    const nieuw = prompt("Nieuw wachtwoord voor deze gebruiker:");
    if (!nieuw) return;

    const response = await fetch("/api/admin/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, nieuwWachtwoord: nieuw }),
    });

    if (response.ok) {
      alert("✅ Wachtwoord gewijzigd.");
    } else {
      alert("❌ Wijzigen mislukt.");
    }
  }

  async function rechtWijzigen(uid: string, moduleId: string, niveau: PermissieNiveau) {
    setRechtenPerGebruiker((prev) => ({
      ...prev,
      [uid]: { ...prev[uid], [moduleId]: niveau },
    }));

    await fetch("/api/admin/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, moduleId, niveau }),
    });
  }

  async function beheerWachtwoordWijzigen() {
    setBeheerWachtwoordMelding("");

    if (nieuwBeheerWachtwoord.length < 4) {
      setBeheerWachtwoordMelding("❌ Minimaal 4 tekens.");
      return;
    }

    const response = await fetch("/api/admin/set-beheer-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nieuwWachtwoord: nieuwBeheerWachtwoord }),
    });

    if (response.ok) {
      setBeheerWachtwoordMelding("✅ Beheer-wachtwoord gewijzigd.");
      setNieuwBeheerWachtwoord("");
    } else {
      setBeheerWachtwoordMelding("❌ Wijzigen mislukt.");
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">🛠️</div>
          <h1 className="text-3xl font-bold">Beheer</h1>
        </div>

        {/* Nieuwe gebruiker aanmaken */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <h2 className="text-xl font-bold mb-3">➕ Nieuwe gebruiker</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              value={nieuweUsername}
              onChange={(e) => setNieuweUsername(e.target.value)}
              placeholder="Gebruikersnaam (voor inloggen)"
              className="rounded-xl p-3 text-black bg-white"
            />
            <input
              value={nieuweDisplayName}
              onChange={(e) => setNieuweDisplayName(e.target.value)}
              placeholder="Weergavenaam"
              className="rounded-xl p-3 text-black bg-white"
            />
            <input
              type="password"
              value={nieuwWachtwoord}
              onChange={(e) => setNieuwWachtwoord(e.target.value)}
              placeholder="Wachtwoord"
              className="rounded-xl p-3 text-black bg-white"
            />
            <label className="flex items-center gap-2 bg-white/10 rounded-xl p-3">
              <input
                type="checkbox"
                checked={nieuweIsAdmin}
                onChange={(e) => setNieuweIsAdmin(e.target.checked)}
                className="w-5 h-5"
              />
              Is beheerder
            </label>
          </div>

          {aanmakenFout && <p className="text-red-300 text-sm mb-3">{aanmakenFout}</p>}

          <button
            onClick={gebruikerAanmaken}
            disabled={aanmakenBezig}
            className="w-full bg-green-600 disabled:bg-gray-500 rounded-xl p-3 font-bold"
          >
            {aanmakenBezig ? "Bezig..." : "Gebruiker aanmaken"}
          </button>
        </div>

        {/* Gebruikers + rechtenmatrix */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <h2 className="text-xl font-bold mb-3">👥 Gebruikers & rechten</h2>

          {laden && <p className="opacity-80">Laden...</p>}

          <div className="flex flex-col gap-4">
            {gebruikers.map((g) => (
              <div key={g.uid} className="bg-white/10 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="font-bold text-lg">{g.displayName}</span>
                    <span className="opacity-70 text-sm ml-2">@{g.username}</span>
                    {g.isAdmin && (
                      <span className="ml-2 bg-purple-600 text-xs px-2 py-1 rounded-full">
                        beheerder
                      </span>
                    )}
                    {g.heeftFaceId && (
                      <span className="ml-2 bg-blue-600 text-xs px-2 py-1 rounded-full">
                        Face ID
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => wachtwoordResetten(g.uid)}
                      className="bg-white/20 px-3 py-2 rounded-lg text-sm font-bold"
                    >
                      🔑 Wachtwoord
                    </button>
                    <button
                      onClick={() => gebruikerVerwijderen(g.uid, g.displayName)}
                      className="bg-red-700 px-3 py-2 rounded-lg text-sm font-bold"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {MODULES.map((module) => {
                    const huidigNiveau =
                      rechtenPerGebruiker[g.uid]?.[module.id] ?? "geen";

                    return (
                      <div
                        key={module.id}
                        className="flex items-center gap-2 flex-wrap"
                      >
                        <span className="w-40 shrink-0">
                          {module.icoon} {module.naam}
                        </span>

                        {(["geen", "lezen", "schrijven"] as PermissieNiveau[]).map(
                          (niveau) => (
                            <button
                              key={niveau}
                              onClick={() => rechtWijzigen(g.uid, module.id, niveau)}
                              className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                huidigNiveau === niveau
                                  ? niveau === "geen"
                                    ? "bg-red-600"
                                    : niveau === "lezen"
                                      ? "bg-yellow-600"
                                      : "bg-green-600"
                                  : "bg-white/20"
                              }`}
                            >
                              {niveau}
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beheer-wachtwoord wijzigen */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <h2 className="text-xl font-bold mb-3">🔒 Beheer-wachtwoord wijzigen</h2>
          <p className="opacity-80 text-sm mb-3">
            Dit is het wachtwoord om dit Beheer-gedeelte te openen — los van
            individuele gebruikerswachtwoorden.
          </p>

          <div className="flex gap-2">
            <input
              type="password"
              value={nieuwBeheerWachtwoord}
              onChange={(e) => setNieuwBeheerWachtwoord(e.target.value)}
              placeholder="Nieuw Beheer-wachtwoord"
              className="flex-1 rounded-xl p-3 text-black bg-white"
            />
            <button
              onClick={beheerWachtwoordWijzigen}
              className="bg-purple-600 rounded-xl px-4 font-bold"
            >
              Wijzigen
            </button>
          </div>

          {beheerWachtwoordMelding && (
            <p className="text-sm mt-2">{beheerWachtwoordMelding}</p>
          )}
        </div>

        <button
          onClick={() => router.push("/beheer/achtergrond")}
          className="bg-white/15 rounded-2xl p-4 flex items-center gap-3 font-bold text-lg"
        >
          <span className="text-3xl">🎨</span>
          Achtergrond aanpassen
        </button>

        <button
          onClick={() => router.push("/beheer/archief-onderdelen")}
          className="bg-white/15 rounded-2xl p-4 flex items-center gap-3 font-bold text-lg"
        >
          <span className="text-3xl">🗄️</span>
          Archief-onderdelen beheren
        </button>

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
