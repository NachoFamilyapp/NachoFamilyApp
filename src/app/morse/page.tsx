"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import MorseLight from "@/components/morse/MorseLight";
import OnScreenKeyboard from "@/components/morse/OnScreenKeyboard";

import { MorseGameService } from "@/lib/morseService";
import { textToFlashSequence } from "@/lib/morse";

export default function MorseSpelPage() {
  const router = useRouter();

  const [word, setWord] = useState("");
  const [sentAt, setSentAt] = useState(0);
  const [playToken, setPlayToken] = useState(0);
  const [guess, setGuess] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    const unsubscribe = MorseGameService.subscribeToWoord((broadcast) => {
      if (broadcast.sentAt !== sentAt && broadcast.sentAt > 0) {
        setWord(broadcast.word);
        setSentAt(broadcast.sentAt);
        setGuess([]);
        setResult(null);
        setPlayToken((t) => t + 1);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sequence = useMemo(() => textToFlashSequence(word), [word]);

  function letterTyped(letter: string) {
    if (result === "correct") return;
    if (guess.length >= word.length) return;
    setGuess((g) => [...g, letter]);
    setResult(null);
  }

  function backspace() {
    if (result === "correct") return;
    setGuess((g) => g.slice(0, -1));
    setResult(null);
  }

  function controleer() {
    if (guess.length !== word.length) return;
    setResult(guess.join("") === word ? "correct" : "incorrect");
  }

  if (sentAt === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white gap-4 text-center">
        <div className="text-6xl">💡</div>
        <h1 className="text-2xl font-bold">Morse Spel</h1>
        <p className="opacity-80">
          Wacht tot de beheerder een woord verstuurt...
        </p>
        <button onClick={() => router.push("/")} className="underline opacity-80 mt-2">
          🏠 Terug naar Home
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col text-white">
      {/* Bovenkant: morse-lichtweergave */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 min-h-0">
        <MorseLight sequence={sequence} playToken={playToken} />
        <button
          onClick={() => setPlayToken((t) => t + 1)}
          className="bg-blue-600 active:bg-blue-500 px-4 py-2 rounded-xl font-bold text-sm"
        >
          ▶️ Speel opnieuw af
        </button>
      </div>

      {/* Middenkant: typ-weergave */}
      <div className="flex flex-col items-center justify-center gap-3 p-4">
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: word.length }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-12 rounded-lg bg-white/20 flex items-center justify-center text-xl font-bold"
            >
              {guess[i] ?? ""}
            </div>
          ))}
        </div>

        {result === "correct" && (
          <p className="text-green-300 font-bold text-lg">
            ✅ Goed geraden! Het woord was {word}.
          </p>
        )}
        {result === "incorrect" && (
          <p className="text-red-300 font-bold text-lg">
            ❌ Nog niet goed, probeer opnieuw!
          </p>
        )}
      </div>

      {/* Onderkant: toetsenbord */}
      <div className="p-4 pb-6">
        <OnScreenKeyboard
          onLetter={letterTyped}
          onBackspace={backspace}
          onSubmit={controleer}
          disabled={result === "correct"}
        />
      </div>
    </main>
  );
}
