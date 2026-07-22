"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import PasswordGate from "@/components/PasswordGate";

import { AppModulesService } from "@/lib/appModulesService";
import { AppModules } from "@/types/appModules";

const ADMIN_CODE = "5712";

export default function HoofdBeheerPage() {
  return (
    <PasswordGate
      code={ADMIN_CODE}
      sessionKey="hoofdbeheer_ok"
      title="Hoofdbeheer"
      backHref="/"
    >
      <BeheerHub />
    </PasswordGate>
  );
}

function BeheerHub() {
  const router = useRouter();

  const [modules, setModules] = useState<AppModules | null>(null);

  useEffect(() => {
    // getModules() is async; state-update gebeurt na een await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    AppModulesService.getModules().then(setModules);
  }, []);

  async function toggle(key: keyof AppModules) {
    if (!modules) return;
    const next = { ...modules, [key]: !modules[key] };
    setModules(next);
    await AppModulesService.setModuleActive(key, next[key]);
  }

  return (
    <main className="min-h-screen text-white p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">🛠️</div>
          <h1 className="text-3xl font-bold">Hoofdbeheer</h1>
          <p className="opacity-80 mt-1">
            Zet hier onderdelen van de hele app aan of uit voor spelers.
          </p>
        </div>

        {!modules ? (
          <p className="text-center opacity-80 py-10">Laden...</p>
        ) : (
          <Card className="text-white">
            <div className="flex flex-col gap-3">
              <ModuleRow
                icon="🗺️"
                title="Onderdeel 1: Kaart"
                subtitle="Toegankelijkheid van attracties opzoeken"
                active={modules.map}
                onToggle={() => toggle("map")}
                onManage={() => router.push("/kaart")}
                manageLabel="Open"
              />

              <ModuleRow
                icon="🚩"
                title="Onderdeel 2: Vlag Veroveren"
                subtitle="Buiten spelen met GPS, 2 teams"
                active={modules.vlag}
                onToggle={() => toggle("vlag")}
                onManage={() => router.push("/admin")}
                manageLabel="Beheer spel"
              />

              <ModuleRow
                icon="🧭"
                title="Onderdeel 3: Speurtocht"
                subtitle="Kompas-tocht en Waar ben ik?"
                active={modules.speurtocht}
                onToggle={() => toggle("speurtocht")}
                onManage={() => router.push("/speurtocht/beheer")}
                manageLabel="Beheer"
              />
            </div>
          </Card>
        )}

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

function ModuleRow({
  icon,
  title,
  subtitle,
  active,
  onToggle,
  onManage,
  manageLabel,
}: {
  icon: string;
  title: string;
  subtitle: string;
  active: boolean;
  onToggle: () => void;
  onManage: () => void;
  manageLabel: string;
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <div className="font-bold text-lg">{title}</div>
          <div className="text-sm opacity-70">{subtitle}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`flex-1 p-3 rounded-xl font-bold ${
            active ? "bg-green-600" : "bg-red-700"
          }`}
        >
          {active ? "✅ Zichtbaar voor spelers" : "❌ Verborgen"}
        </button>

        <button
          onClick={onManage}
          className="px-4 rounded-xl font-bold bg-white/20"
        >
          {manageLabel}
        </button>
      </div>
    </div>
  );
}
