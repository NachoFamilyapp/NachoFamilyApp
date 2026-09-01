"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startRegistration } from "@simplewebauthn/browser";
import { useHuidigeGebruiker } from "@/lib/useHuidigeGebruiker";

export default function AccountPage() {
  const router = useRouter();
  const { gebruiker, laden, verversen } = useHuidigeGebruiker();

  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");
  const [fout, setFout] = useState("");

  async function faceIdInstellen() {
    setFout("");
    setMelding("");
    setBezig(true);

    try {
      const optiesResponse = await fetch("/api/auth/webauthn/register-options", {
        method: "POST",
      });
      const optiesData = await optiesResponse.json();

      if (!optiesResponse.ok) {
        setFout(optiesData.error ?? "Kon niet starten.");
        return;
      }

      const registratie = await startRegistration({ optionsJSON: optiesData });

      const apparaatLabel =
        typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 40) : "Dit apparaat";

      const verifyResponse = await fetch("/api/auth/webauthn/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: registratie, apparaatLabel }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setFout(verifyData.error ?? "Registreren mislukt.");
        return;
      }

      setMelding("✅ Face ID is ingesteld voor dit apparaat!");
      await verversen();
    } catch (error) {
      console.error(error);
      setFout("Face ID instellen werd geannuleerd of is mislukt.");
    } finally {
      setBezig(false);
    }
  }

  if (laden || !gebruiker) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Laden...
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">⚙️</div>
          <h1 className="text-2xl font-bold">Mijn account</h1>
          <p className="opacity-80 mt-1">{gebruiker.displayName}</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <p className="font-bold mb-1">
            Face ID: {gebruiker.heeftFaceId ? "✅ Ingesteld" : "❌ Nog niet ingesteld"}
          </p>
          <p className="text-sm opacity-80">
            Je wachtwoord blijft altijd werken, ook als je Face ID instelt —
            handig als je een keer een ander apparaat gebruikt.
          </p>
        </div>

        <button
          onClick={faceIdInstellen}
          disabled={bezig}
          className="w-full bg-blue-600 disabled:bg-gray-500 rounded-xl p-3 font-bold mb-3"
        >
          {bezig ? "Bezig..." : "🔓 Face ID instellen op dit apparaat"}
        </button>

        {melding && <p className="text-green-300 text-sm text-center mb-2">{melding}</p>}
        {fout && <p className="text-red-300 text-sm text-center mb-2">{fout}</p>}

        <button
          onClick={() => router.push("/")}
          className="w-full underline opacity-80 text-sm mt-2"
        >
          ← Terug naar Home
        </button>
      </div>
    </main>
  );
}
