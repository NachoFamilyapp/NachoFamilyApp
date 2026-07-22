"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BigButton from "@/components/ui/BigButton";
import Card from "@/components/ui/Card";

import { AppModulesService } from "@/lib/appModulesService";
import { AppModules } from "@/types/appModules";

export default function HomePage() {

  const router = useRouter();

  const [modules, setModules] = useState<AppModules | null>(null);

  useEffect(() => {
    AppModulesService.getModules().then(setModules);
  }, []);

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

      {/* Menu */}

      <Card className="w-full max-w-md">

        <div className="space-y-5">

          {modules?.map && (
            <BigButton
              icon="🗺️"
              color="blue"
              onClick={() => router.push("/kaart")}
            >
              Onderdeel 1: Kaart
            </BigButton>
          )}

          {modules?.vlag && (
            <>
              <BigButton
                icon="🟢"
                color="green"
                onClick={() =>
                  router.push("/create-game")
                }
              >
                Onderdeel 2: Vlag Veroveren starten
              </BigButton>

              <BigButton
                icon="🔵"
                color="blue"
                onClick={() =>
                  router.push("/join-game")
                }
              >
                Meedoen aan Vlag Veroveren
              </BigButton>
            </>
          )}

          {modules?.speurtocht && (
            <BigButton
              icon="🧭"
              color="purple"
              onClick={() =>
                router.push("/speurtocht")
              }
            >
              Onderdeel 3: Speurtocht
            </BigButton>
          )}

          <BigButton
            icon="🛠️"
            color="yellow"
            onClick={() =>
              router.push("/beheer")
            }
          >
            Hoofdbeheer
          </BigButton>

          <BigButton
            icon="📖"
            color="purple"
            onClick={() =>
              router.push("/about")
            }
          >
            Handleiding
          </BigButton>

        </div>

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
