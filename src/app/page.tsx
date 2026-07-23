"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BigButton from "@/components/ui/BigButton";
import Card from "@/components/ui/Card";

import { useUser } from "@/components/UserProvider";
import { AppModulesService } from "@/lib/appModulesService";
import { AppModules } from "@/types/appModules";

type Stap = "kies" | "naam" | "menu";

export default function HomePage() {
  const router = useRouter();
  const { profile, setName } = useUser();

  const [stap, setStap] = useState<Stap>("kies");
  const [naamInput, setNaamInput] = useState("");
  const [opslaan, setOpslaan] = useState(false);

  const [modules, setModules] = useState<AppModules | null>(null);

  useEffect(() => {
    AppModulesService.getModules().then(setModules);
  }, []);

  function kiesGebruiker() {
    if (profile) {
      setStap("menu");
    } else {
      setStap("naam");
    }
  }

  function kiesBeheerder() {
    router.push("/beheer");
  }

  async function bevestigNaam() {
    if (!naamInput.trim()) return;

    setOpslaan(true);
    try {
      await setName(naamInput.trim());
      setStap("menu");
    } finally {
      setOpslaan(false);
    }
  }

  return (

    <main
      className="
      min-h-screen

      flex

      flex-col

      items-center

      justify-between

      p-6

      relative

      overflow-hidden
    "
    >

      {/* Wolken */}

      <div className="absolute top-6 left-8 text-6xl opacity-70">
        ☁️
      </div>

      <div className="absolute top-20 right-8 text-5xl opacity-60">
        ☁️
      </div>

      <div className="absolute top-40 left-20 text-4xl opacity-50">
        ☁️
      </div>

      {/* Titel */}

      <div className="flex flex-col items-center mt-10">

        <div className="text-8xl">

          🏖️

        </div>

        <h1
          className="
          text-5xl
          font-black
          mt-4
          drop-shadow-lg
        "
        >
          Vakantie App
        </h1>

        <p
          className="
          mt-3
          text-xl
          opacity-90
        "
        >
          Het avontuur begint hier
        </p>

      </div>

      {/* Inhoud */}

      <Card className="w-full max-w-md">

        {stap === "kies" && (
          <div className="space-y-5">
            <BigButton icon="👤" color="green" onClick={kiesGebruiker}>
              Ik ben een gebruiker
            </BigButton>

            <BigButton icon="🔑" color="purple" onClick={kiesBeheerder}>
              Ik ben de beheerder
            </BigButton>
          </div>
        )}

        {stap === "naam" && (
          <div className="space-y-4 text-center">
            <p className="text-lg font-bold">Wat is je naam?</p>

            <input
              value={naamInput}
              onChange={(e) => setNaamInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && bevestigNaam()}
              placeholder="Jouw naam"
              className="w-full rounded-xl p-4 text-black bg-white text-center text-xl"
              autoFocus
            />

            <BigButton icon="✅" color="green" onClick={bevestigNaam} disabled={opslaan}>
              {opslaan ? "Bezig..." : "Start"}
            </BigButton>

            <button
              onClick={() => setStap("kies")}
              className="underline opacity-80 text-sm"
            >
              ← Terug
            </button>
          </div>
        )}

        {stap === "menu" && (
          <div className="space-y-5">

            {modules?.map && (
              <BigButton
                icon="🗺️"
                color="blue"
                onClick={() => router.push("/kaart")}
              >
                Slagharen app
              </BigButton>
            )}

            {modules?.vlag && (
              <BigButton
                icon="🚩"
                color="green"
                onClick={() => router.push("/vlag-veroveren")}
              >
                Vlag Veroveren
              </BigButton>
            )}

            {modules?.speurtocht && (
              <BigButton
                icon="🧭"
                color="purple"
                onClick={() => router.push("/speurtocht")}
              >
                Speurtocht
              </BigButton>
            )}

            {modules?.morse && (
              <BigButton
                icon="💡"
                color="yellow"
                onClick={() => router.push("/morse")}
              >
                Morse Spel
              </BigButton>
            )}

            {modules?.noodbericht && (
              <BigButton
                icon="🚨"
                color="yellow"
                onClick={() => router.push("/noodbericht")}
              >
                Noodbericht
              </BigButton>
            )}

            <BigButton
              icon="📖"
              color="purple"
              onClick={() => router.push("/about")}
            >
              Handleiding
            </BigButton>

            <button
              onClick={() => setStap("kies")}
              className="underline opacity-80 text-sm block mx-auto"
            >
              ← Andere keuze
            </button>

          </div>
        )}

      </Card>

      {/* Footer */}

      <div
        className="
        text-center
        opacity-80
        mb-4
      "
      >

        <div className="text-lg font-bold">

          Version 2.0 Alpha

        </div>

        <div>

          🏖️ Vakantie App

        </div>

      </div>

      {/* Gras */}

      <div
        className="
        absolute

        bottom-0

        left-0

        w-full

        h-20

        bg-green-700

        rounded-t-[60px]
      "
      />

    </main>

  );

}
