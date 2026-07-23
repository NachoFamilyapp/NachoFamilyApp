"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";
import MorseLight from "@/components/morse/MorseLight";

import { MorseService } from "@/lib/morseService";
import { textToFlashSequence } from "@/lib/morse";

export default function MorseLivePage() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [sentAt, setSentAt] = useState(0);
  const [playToken, setPlayToken] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    const unsubscribe = MorseService.subscribeToBroadcast((broadcast) => {
      setMessage(broadcast.message);

      if (broadcast.sentAt !== sentAt && broadcast.sentAt > 0) {
        setSentAt(broadcast.sentAt);
        setRevealed(false);
        setGuess("");
        setPlayToken((t) => t + 1);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequence = useMemo(() => textToFlashSequence(message), [message]);

  return (
    <main className="min-h-screen flex flex-col items-center p-6 gap-6 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">📡 Live boodschap</h1>
        <p className="opacity-80 text-sm mt-1">
          Wacht tot de beheerder een seinbericht stuurt.
        </p>
      </div>

      <MorseLight sequence={sequence} playToken={playToken} />

      {sentAt > 0 && (
        <button
          onClick={() => setPlayToken((t) => t + 1)}
          className="bg-blue-600 active:bg-blue-500 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          ▶️ Speel opnieuw af
        </button>
      )}

      {sentAt === 0 && (
        <p className="opacity-70 text-center">
          Er is nog geen bericht verstuurd.
        </p>
      )}

      {sentAt > 0 && (
        <Card className="w-full max-w-sm text-white">
          <label className="block font-bold mb-2 text-center">
            Wat denk je dat het bericht is?
          </label>

          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Jouw antwoord"
            className="w-full rounded-xl p-3 text-black bg-white mb-3 text-center"
          />

          {revealed ? (
            <div className="bg-green-700 rounded-xl p-3 text-center font-bold">
              Het bericht was: {message}
            </div>
          ) : (
            <BigButton icon="🔍" color="yellow" onClick={() => setRevealed(true)}>
              Onthul het bericht
            </BigButton>
          )}
        </Card>
      )}

      <button
        onClick={() => router.push("/morse")}
        className="underline opacity-80"
      >
        ← Terug
      </button>
    </main>
  );
}
