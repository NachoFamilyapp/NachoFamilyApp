"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import PasswordGate from "@/components/PasswordGate";

import { AppThemeService } from "@/lib/appThemeService";
import { compressImageForStorage } from "@/lib/imageUtils";
import { AppTheme, DEFAULT_APP_THEME } from "@/types/appTheme";

const ADMIN_CODE = "5712";

export default function AchtergrondBeheerPage() {
  return (
    <PasswordGate
      code={ADMIN_CODE}
      sessionKey="hoofdbeheer_ok"
      title="Achtergrond"
      backHref="/beheer"
    >
      <AchtergrondPaneel />
    </PasswordGate>
  );
}

function AchtergrondPaneel() {
  const router = useRouter();

  const [theme, setThemeState] = useState<AppTheme | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // getTheme() is async; state-update gebeurt na een await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    AppThemeService.getTheme().then(setThemeState);
  }, []);

  async function opslaan(next: AppTheme) {
    setSaving(true);
    try {
      await AppThemeService.setTheme(next);
      setThemeState(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
      alert(
        "❌ Opslaan is mislukt. De wijziging is NIET bewaard. " +
          "Mogelijke oorzaken: de afbeelding is te groot, of er is geen " +
          "toegang tot de database. Probeer een kleinere foto of check je " +
          "internetverbinding."
      );
    } finally {
      setSaving(false);
    }
  }

  async function afbeeldingKiezen(file: File) {
    if (!theme) return;

    setUploading(true);
    try {
      const { dataUrl, withinLimit } = await compressImageForStorage(file);

      if (!withinLimit) {
        alert(
          "❌ Deze afbeelding is te groot/gedetailleerd om op te slaan, " +
            "zelfs na comprimeren. Kies een eenvoudigere of kleinere foto."
        );
        return;
      }

      await opslaan({ ...theme, backgroundImage: dataUrl });
    } catch (error) {
      console.error(error);
      alert("Afbeelding uploaden mislukt");
    } finally {
      setUploading(false);
    }
  }

  function kleurWijzigen(kleur: string) {
    if (!theme) return;
    opslaan({ ...theme, backgroundColor: kleur });
  }

  async function afbeeldingVerwijderen() {
    if (!theme) return;
    await opslaan({ ...theme, backgroundImage: null });
  }

  async function terugNaarStandaard() {
    await opslaan(DEFAULT_APP_THEME);
  }

  if (!theme) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Laden...
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white p-6">
      <div className="max-w-md mx-auto flex flex-col gap-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">🎨</div>
          <h1 className="text-3xl font-bold">Achtergrond</h1>
          <p className="opacity-80 mt-1">
            De kleur en/of afbeelding hieronder gelden voor de hele app, op
            elk scherm.
          </p>
        </div>

        <Card className="text-white">
          <label className="block font-bold mb-2">Achtergrondkleur</label>
          <div className="flex items-center gap-3 mb-2">
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => kleurWijzigen(e.target.value)}
              className="w-16 h-12 rounded-lg cursor-pointer bg-transparent"
            />
            <span className="font-bold">{theme.backgroundColor}</span>
          </div>
          <p className="text-xs opacity-70">
            Deze kleur is altijd zichtbaar — als er ook een afbeelding is
            ingesteld, wordt die erover getoond.
          </p>
        </Card>

        <Card className="text-white">
          <label className="block font-bold mb-2">Achtergrondafbeelding</label>

          {theme.backgroundImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={theme.backgroundImage}
              alt="Huidige achtergrond"
              className="w-full rounded-xl mb-3 max-h-48 object-cover"
            />
          )}

          <label className="block">
            <span className="block bg-blue-600 rounded-xl p-3 text-center font-bold cursor-pointer">
              {uploading ? "Bezig..." : "📷 Afbeelding kiezen"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) afbeeldingKiezen(file);
              }}
            />
          </label>

          {theme.backgroundImage && (
            <button
              onClick={afbeeldingVerwijderen}
              className="w-full bg-red-700 rounded-xl p-3 font-bold mt-3"
            >
              🗑️ Afbeelding verwijderen
            </button>
          )}
        </Card>

        {saved && (
          <p className="text-green-300 font-bold text-center">✅ Opgeslagen</p>
        )}
        {saving && !saved && (
          <p className="opacity-70 text-center text-sm">Bezig met opslaan...</p>
        )}

        <button
          onClick={terugNaarStandaard}
          className="underline opacity-70 text-sm mx-auto"
        >
          Terugzetten naar standaard achtergrond
        </button>

        <button
          onClick={() => router.push("/beheer")}
          className="underline opacity-80 mx-auto mt-2"
        >
          ← Terug naar Hoofdbeheer
        </button>
      </div>
    </main>
  );
}
