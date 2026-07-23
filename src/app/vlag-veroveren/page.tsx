"use client";

import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";

export default function VlagVeroverenPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 text-white">
      <div className="text-center">
        <div className="text-6xl mb-2">🚩</div>
        <h1 className="text-4xl font-bold">Vlag Veroveren</h1>
        <p className="opacity-90 mt-2">
          Twee teams, GPS, en de vlag van de tegenstander veroveren!
        </p>
      </div>

      <Card className="w-full max-w-sm flex flex-col gap-4 text-white">
        <BigButton
          icon="🟢"
          color="green"
          onClick={() => router.push("/create-game")}
        >
          Spel starten
        </BigButton>

        <BigButton
          icon="🔵"
          color="blue"
          onClick={() => router.push("/join-game")}
        >
          Meedoen
        </BigButton>
      </Card>

      <button
        onClick={() => router.push("/")}
        className="underline opacity-80 mt-2"
      >
        🏠 Terug naar Home
      </button>
    </main>
  );
}
