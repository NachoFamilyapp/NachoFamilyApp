"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import PasswordGate from "@/components/PasswordGate";
import MorseLight from "@/components/morse/MorseLight";

import { MorseGameService } from "@/lib/morseService";
import { textToFlashSequence } from "@/lib/morse";

const ADMIN_CODE = "5712";

export default function MorseSpelBeheerPage() {
  return (
    <PasswordGate
      code={ADMIN_CODE}
      sessionKey="morse_admin_ok"
      title="Beheer Morse Spel"
      backHref="/"
    >
      <MorseSpelBeheerPanel />
    </PasswordGate>
  );
}

function MorseSpelBeheerPanel() {
  const router = useRouter();

  const [word, setWord] = useState("");
  const [sending, setSending] = useState(false);
  const [playToken, setPlayToken] = useState(0);
  const [sent, setSent] = useState(false);

  const cleanWord = word.trim().toUpperCase().replace(/\s+/g, "");
  const sequence = textToFlashSequence(cleanWord);

  async function verstuur() {
    if (!cleanWord) return;

    setSending(true);
    try {
      await MorseGameService.stuurWoord(cleanWord);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Versturen mislukt");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen text-white p-6">
      <div className="max-w-md mx-auto flex flex-col gap-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">💡</div>
          <h1 className="text-3xl font-bold">Beheer Morse Spel</h1>
          <p className="opacity-80 mt-1">
            Typ een woord. Zodra je verstuurt, knippert het op alle
            telefoons van spelers op het Morse Spel-scherm.
          </p>
        </div>

        <Card className="text-white">
          <label className="block font-bold mb-2">Woord</label>
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Bijv. ACHTBAAN"
            className="w-full rounded-xl p-3 text-black bg-white mb-2 text-center text-lg font-bold uppercase"
          />

          {cleanWord && (
            <p className="text-center text-sm opacity-80 mb-4">
              {cleanWord.length} letters:{" "}
              {Array.from({ length: cleanWord.length })
                .map(() => "●")
                .join(" ")}
            </p>
          )}

          <div className="flex justify-center mb-4">
            <MorseLight sequence={sequence} playToken={playToken} />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPlayToken((t) => t + 1)}
              disabled={!cleanWord}
              className="flex-1 bg-blue-600 disabled:bg-gray-500 rounded-xl p-3 font-bold"
            >
              ▶️ Test hier
            </button>

            <button
              onClick={verstuur}
              disabled={!cleanWord || sending}
              className="flex-1 bg-green-600 disabled:bg-gray-500 rounded-xl p-3 font-bold"
            >
              {sending ? "Bezig..." : "📡 Verstuur naar spelers"}
            </button>
          </div>

          {sent && (
            <p className="text-green-300 font-bold text-center mt-3">
              ✅ Verstuurd!
            </p>
          )}
        </Card>

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
