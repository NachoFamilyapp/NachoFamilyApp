"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BigButton from "@/components/ui/BigButton";
import Card from "@/components/ui/Card";
import { useHuidigeGebruiker } from "@/lib/useHuidigeGebruiker";
import { heeftToegang } from "@/types/account";

export default function HomePage() {
  const router = useRouter();
  const { gebruiker, rechten, laden } = useHuidigeGebruiker();

  useEffect(() => {
    if (!laden && !gebruiker) {
      router.push("/login");
    }
  }, [laden, gebruiker, router]);

  async function uitloggen() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (laden || !gebruiker) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(to bottom, #4f46e5, #0f172a)" }}
      >
        <span className="text-white">Laden...</span>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-between p-6 relative overflow-hidden text-white"
      style={{ background: "linear-gradient(to bottom, #4f46e5, #0f172a)" }}
    >
      <div className="flex flex-col items-center mt-10">
        <div className="text-8xl">🏖️</div>
        <h1 className="text-5xl font-black mt-4 drop-shadow-lg">Vakantie App</h1>
        <p className="mt-3 text-xl opacity-90">Welkom, {gebruiker.displayName}!</p>
      </div>

      <Card className="w-full max-w-md">
        <div className="space-y-5">
          {heeftToegang(rechten["archief"], "lezen") && (
            <BigButton icon="🗄️" color="blue" onClick={() => router.push("/archief")}>
              Archief (Vakantie App)
            </BigButton>
          )}

          {heeftToegang(rechten["games"], "lezen") && (
            <BigButton icon="🎮" color="green" onClick={() => router.push("/games")}>
              Games
            </BigButton>
          )}

          {!heeftToegang(rechten["archief"], "lezen") &&
            !heeftToegang(rechten["games"], "lezen") && (
              <p className="text-center opacity-80">
                Je hebt nog geen toegang tot een onderdeel. Vraag de beheerder.
              </p>
            )}

          {gebruiker.isAdmin && (
            <BigButton icon="🛠️" color="purple" onClick={() => router.push("/beheer")}>
              Beheer
            </BigButton>
          )}

          <BigButton icon="⚙️" color="yellow" onClick={() => router.push("/account")}>
            Mijn account (Face ID)
          </BigButton>

          <button onClick={uitloggen} className="underline opacity-70 text-sm block mx-auto">
            Uitloggen
          </button>
        </div>
      </Card>

      <div className="text-center opacity-80 mb-4">
        <div className="text-lg font-bold">Version 3.0</div>
        <div>🏖️ Vakantie App</div>
      </div>
    </main>
  );
}
