"use client";

import { useRouter } from "next/navigation";

import BigButton from "@/components/ui/BigButton";
import Card from "@/components/ui/Card";

export default function HomePage() {

  const router = useRouter();

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

          🦁

        </div>

        <h1
          className="
          text-5xl
          font-black
          mt-4
          drop-shadow-lg
        "
        >
          NachoFamilyApp
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

          <BigButton
            icon="🟢"
            color="green"
            onClick={() =>
              router.push("/create-game")
            }
          >
            Maak Game
          </BigButton>

          <BigButton
            icon="🔵"
            color="blue"
            onClick={() =>
              router.push("/join-game")
            }
          >
            Join Game
          </BigButton>

          <BigButton
            icon="⚙️"
            color="yellow"
            onClick={() =>
              router.push("/admin")
            }
          >
            Instellingen
          </BigButton>

          <BigButton
            icon="🧭"
            color="purple"
            onClick={() =>
              router.push("/speurtocht")
            }
          >
            Speurtocht
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

          🦁 Powered by Nacho

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