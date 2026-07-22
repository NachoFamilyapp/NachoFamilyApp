"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";
import MorseLight from "@/components/morse/MorseLight";
import { useUser } from "@/components/UserProvider";

import { NoodberichtService } from "@/lib/noodberichtService";
import { textToFlashSequence } from "@/lib/morse";

export default function NoodberichtPage() {
  const router = useRouter();
  const { uid } = useUser();

  const [message, setMessage] = useState("");
  const [sentAt, setSentAt] = useState(0);
  const [voorMij, setVoorMij] = useState(false);
  const [playToken, setPlayToken] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    const unsubscribe = NoodberichtService.subscribeToBroadcast((broadcast) => {
      if (broadcast.sentAt === sentAt || broadcast.sentAt === 0) return;

      const isVoorMij =
        broadcast.targetType === "alle" ||
        (uid !== null && broadcast.targetUids.includes(uid));

      setSentAt(broadcast.sentAt);
      setVoorMij(isVoorMij);

      if (isVoorMij) {
        setMessage(broadcast.message);
        setRevealed(false);
        setGuess("");
        setPlayToken((t) => t + 1);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const sequence = useMemo(() => textToFlashSequence(message), [message]);

  return (
    <main className="min-h-screen flex flex-col items-center p-6 gap-6 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">🚨 Noodbericht</h1>
        <p className="opacity-80 text-sm mt-1">
          Wacht tot de beheerder een seinbericht stuurt.
        </p>
      </div>

      {sentAt === 0 && (
        <p className="opacity-70 text-center">
          Er is nog geen bericht verstuurd.
        </p>
      )}

      {sentAt > 0 && !voorMij && (
        <p className="opacity-70 text-center">
          Er is een bericht verstuurd, maar niet voor jou.
        </p>
      )}

      {sentAt > 0 && voorMij && (
        <>
          <MorseLight sequence={sequence} playToken={playToken} />

          <button
            onClick={() => setPlayToken((t) => t + 1)}
            className="bg-blue-600 active:bg-blue-500 px-6 py-4 rounded-2xl text-xl font-bold"
          >
            ▶️ Speel opnieuw af
          </button>

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
        </>
      )}

      <button onClick={() => router.push("/")} className="underline opacity-80">
        🏠 Terug naar Home
      </button>
    </main>
  );
}
