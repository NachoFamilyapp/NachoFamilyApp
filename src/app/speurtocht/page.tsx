"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";
import { SpeurtochtService } from "@/lib/speurtochtService";

export default function SpeurtochtHomePage() {
  const router = useRouter();

  const [fotospelActive, setFotospelActive] = useState(false);

  useEffect(() => {
    SpeurtochtService.getFotospelSettings().then((settings) =>
      setFotospelActive(settings.active)
    );
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 text-white">

      <div className="text-center">
        <div className="text-6xl mb-2">🧭</div>
        <h1 className="text-4xl font-bold">Speurtocht</h1>
        <p className="opacity-90 mt-2">
          Volg het kompas, los de puzzels op!
        </p>
      </div>

      <Card className="w-full max-w-sm flex flex-col gap-4 text-white">

        <BigButton
          icon="🧭"
          color="blue"
          onClick={() => router.push("/speurtocht/kompas")}
        >
          Start Kompas Speurtocht
        </BigButton>

        {fotospelActive && (
          <BigButton
            icon="📸"
            color="yellow"
            onClick={() => router.push("/speurtocht/foto")}
          >
            Fotospel
          </BigButton>
        )}

        <BigButton
          icon="🔒"
          color="purple"
          onClick={() => router.push("/speurtocht/beheer")}
        >
          Beheer
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
