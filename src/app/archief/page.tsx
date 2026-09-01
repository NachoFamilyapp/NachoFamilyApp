"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BigButton from "@/components/ui/BigButton";
import Card from "@/components/ui/Card";
import { useHuidigeGebruiker } from "@/lib/useHuidigeGebruiker";
import { heeftToegang } from "@/types/account";
import { AppModulesService } from "@/lib/appModulesService";
import { AppModules } from "@/types/appModules";

export default function ArchiefPage() {
  const router = useRouter();
  const { gebruiker, rechten, laden: gebruikerLaden } = useHuidigeGebruiker();
  const [modules, setModules] = useState<AppModules | null>(null);

  useEffect(() => {
    AppModulesService.getModules().then(setModules);
  }, []);

  if (gebruikerLaden) {
    return <main className="min-h-screen flex items-center justify-center text-white">Laden...</main>;
  }

  if (!gebruiker) {
    router.push("/login");
    return null;
  }

  if (!heeftToegang(rechten["archief"], "lezen")) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-4 text-center text-white">
        <div className="text-5xl">🔒</div>
        <p>Je hebt geen toegang tot het Archief.</p>
        <button onClick={() => router.push("/")} className="underline opacity-80">
          ← Terug naar Home
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 text-white">
      <div className="text-center">
        <div className="text-6xl mb-2">🗄️</div>
        <h1 className="text-4xl font-bold">Archief</h1>
        <p className="opacity-90 mt-2">De oude Vakantie App, nog steeds speelbaar</p>
      </div>

      <Card className="w-full max-w-md">
        <div className="space-y-5">
          {modules?.map && (
            <BigButton icon="🗺️" color="blue" onClick={() => router.push("/kaart")}>
              Slagharen app
            </BigButton>
          )}

          {modules?.vlag && (
            <BigButton icon="🚩" color="green" onClick={() => router.push("/vlag-veroveren")}>
              Vlag Veroveren
            </BigButton>
          )}

          {modules?.speurtocht && (
            <BigButton icon="🧭" color="purple" onClick={() => router.push("/speurtocht")}>
              Speurtocht
            </BigButton>
          )}

          {modules?.morse && (
            <BigButton icon="💡" color="yellow" onClick={() => router.push("/morse")}>
              Morse Spel
            </BigButton>
          )}

          {modules?.noodbericht && (
            <BigButton icon="🚨" color="yellow" onClick={() => router.push("/noodbericht")}>
              Noodbericht
            </BigButton>
          )}

          <BigButton icon="📖" color="purple" onClick={() => router.push("/about")}>
            Handleiding
          </BigButton>
        </div>
      </Card>

      <button onClick={() => router.push("/")} className="underline opacity-80 mt-2">
        🏠 Terug naar Home
      </button>
    </main>
  );
}
