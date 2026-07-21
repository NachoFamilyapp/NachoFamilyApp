"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";
import Compass from "@/components/Compass";
import TeamPicker, {
  getStoredSpeurtochtTeam,
} from "@/components/speurtocht/TeamPicker";

import { SpeurtochtService } from "@/lib/speurtochtService";
import { distanceBetween } from "@/lib/gps";
import { LatLng } from "@/types/game";
import { KompasSpeurtocht } from "@/types/speurtocht";

const PROGRESS_KEY = "speurtocht_kompas_progress";

type Progress = {
  checkpointIndex: number;
  letters: string[];
};

function loadProgress(): Progress {
  if (typeof window === "undefined") {
    return { checkpointIndex: 0, letters: [] };
  }

  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // negeer kapotte data
  }

  return { checkpointIndex: 0, letters: [] };
}

function saveProgress(progress: Progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export default function KompasSpeurtochtPage() {
  const router = useRouter();

  const [hunt, setHunt] = useState<KompasSpeurtocht | null>(null);
  const [team, setTeam] = useState(() => getStoredSpeurtochtTeam());

  const [position, setPosition] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [wordAnswer, setWordAnswer] = useState<number[]>([]);
  const [wordError, setWordError] = useState(false);

  // Laad speurtocht
  useEffect(() => {
    SpeurtochtService.getKompasSpeurtocht().then(setHunt);
  }, []);

  const geoSupported =
    typeof window !== "undefined" && "geolocation" in navigator;

  // Volg GPS-positie zodra het spel gestart is
  useEffect(() => {
    if (!started || !geoSupported) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationError(null);
      },
      () => {
        setLocationError(
          "Kon je locatie niet vinden. Sta locatietoegang toe voor deze website."
        );
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [started, geoSupported]);

  if (!hunt) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Speurtocht laden...
      </main>
    );
  }

  const validCheckpoints = hunt.checkpoints.filter(
    (cp) => cp.lat !== null && cp.lng !== null
  );

  if (validCheckpoints.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-white p-6 text-center gap-4">
        <div className="text-5xl">🚧</div>
        <p className="text-xl font-bold">
          De speurtocht is nog niet klaar.
        </p>
        <p className="opacity-80">
          De beheerder moet eerst de locaties van de attracties instellen.
        </p>
        <button
          onClick={() => router.push("/speurtocht")}
          className="underline opacity-80"
        >
          ← Terug
        </button>
      </main>
    );
  }

  // Team nog niet gekozen
  if (!team) {
    return <TeamPicker title={hunt.title} onSelect={setTeam} />;
  }

  // Introscherm
  if (!started) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white text-center">
        <Card className="w-full max-w-sm text-white">
          <div className="text-5xl mb-4 text-center">🧭</div>
          <h1 className="text-2xl font-bold mb-4 text-center">{hunt.title}</h1>
          <p className="opacity-90 mb-6">{hunt.intro}</p>

          {progress.checkpointIndex > 0 && (
            <p className="text-sm opacity-70 mb-4">
              Je was al bij opdracht {progress.checkpointIndex + 1}. Je gaat
              daar verder.
            </p>
          )}

          <BigButton icon="🚀" color="green" onClick={() => setStarted(true)}>
            Start de speurtocht
          </BigButton>
        </Card>
      </main>
    );
  }

  // Eindpuzzel: alle checkpoints gehaald
  if (progress.checkpointIndex >= validCheckpoints.length) {
    return (
      <FinalWordScreen
        hunt={hunt}
        letters={progress.letters}
        wordAnswer={wordAnswer}
        setWordAnswer={setWordAnswer}
        wordError={wordError}
        setWordError={setWordError}
        onReset={() => {
          const fresh = { checkpointIndex: 0, letters: [] };
          setProgress(fresh);
          saveProgress(fresh);
          setWordAnswer([]);
        }}
      />
    );
  }

  const checkpoint = validCheckpoints[progress.checkpointIndex];

  const distance = position
    ? distanceBetween(position, { lat: checkpoint.lat!, lng: checkpoint.lng! })
    : null;

  const arrived = distance !== null && distance <= checkpoint.radius;

  const errorMessage = !geoSupported
    ? "Deze telefoon ondersteunt geen GPS-locatie."
    : locationError;

  function answer(optionIndex: number) {
    if (!arrived) return;

    if (optionIndex === checkpoint.correctIndex) {
      setFeedback("correct");

      setTimeout(() => {
        const next: Progress = {
          checkpointIndex: progress.checkpointIndex + 1,
          letters: [...progress.letters, checkpoint.letter],
        };
        setProgress(next);
        saveProgress(next);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 1200);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 text-white gap-6">
      <div className="text-center">
        <div className="text-sm opacity-80">
          {team} · Opdracht {progress.checkpointIndex + 1} van{" "}
          {validCheckpoints.length}
        </div>
        <h1 className="text-2xl font-bold">
          {checkpoint.emoji} Op zoek naar {checkpoint.targetName}
        </h1>
      </div>

      {errorMessage && (
        <p className="text-red-300 text-center max-w-xs">{errorMessage}</p>
      )}

      <Compass
        currentPosition={position}
        targetPosition={{ lat: checkpoint.lat!, lng: checkpoint.lng! }}
      />

      <Card className="w-full max-w-sm text-white">
        <h2 className="font-bold text-lg mb-3">{checkpoint.question}</h2>

        <div className="flex flex-col gap-2">
          {checkpoint.options.map((option, index) => (
            <button
              key={index}
              onClick={() => answer(index)}
              disabled={!arrived}
              className={`p-4 rounded-xl font-bold text-left transition ${
                arrived
                  ? "bg-blue-600 active:bg-blue-500"
                  : "bg-gray-600 opacity-60"
              }`}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        {!arrived && (
          <p className="text-sm opacity-80 mt-3 text-center">
            🔒 Loop eerst naar {checkpoint.targetName} om te kunnen
            antwoorden.
          </p>
        )}

        {feedback === "correct" && (
          <p className="text-green-300 font-bold text-center mt-3">
            ✅ Goed! Jij kreeg de letter &quot;{checkpoint.letter}&quot;
          </p>
        )}

        {feedback === "wrong" && (
          <p className="text-red-300 font-bold text-center mt-3">
            ❌ Niet helemaal, probeer het nog eens!
          </p>
        )}
      </Card>

      {progress.letters.length > 0 && (
        <div className="flex gap-2">
          {progress.letters.map((letter, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-lg bg-yellow-500 text-black font-bold flex items-center justify-center text-xl"
            >
              {letter}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function FinalWordScreen({
  hunt,
  letters,
  wordAnswer,
  setWordAnswer,
  wordError,
  setWordError,
  onReset,
}: {
  hunt: KompasSpeurtocht;
  letters: string[];
  wordAnswer: number[];
  setWordAnswer: (value: number[]) => void;
  wordError: boolean;
  setWordError: (value: boolean) => void;
  onReset: () => void;
}) {
  const solved =
    wordAnswer.length === hunt.finalWord.length &&
    wordAnswer.map((i) => letters[i]).join("") === hunt.finalWord;

  function tapLetter(index: number) {
    if (wordAnswer.includes(index)) return;
    setWordAnswer([...wordAnswer, index]);
    setWordError(false);
  }

  function removeLast() {
    setWordAnswer(wordAnswer.slice(0, -1));
    setWordError(false);
  }

  function check() {
    if (wordAnswer.map((i) => letters[i]).join("") !== hunt.finalWord) {
      setWordError(true);
    }
  }

  if (solved) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white text-center gap-4">
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-bold">{hunt.finalWord}</h1>
        <p className="text-lg opacity-90 max-w-sm">{hunt.finalMessage}</p>

        <button onClick={onReset} className="underline opacity-70 mt-4">
          Opnieuw spelen
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white gap-6 text-center">
      <div className="text-5xl">🧩</div>
      <h1 className="text-2xl font-bold">Eindopdracht</h1>
      <p className="opacity-90 max-w-sm">
        Je hebt alle letters gevonden! Tik ze in de goede volgorde aan om het
        woord te maken.
      </p>

      <div className="flex gap-2 flex-wrap justify-center">
        {letters.map((letter, index) => (
          <button
            key={index}
            onClick={() => tapLetter(index)}
            disabled={wordAnswer.includes(index)}
            className={`w-12 h-12 rounded-lg font-bold text-xl flex items-center justify-center ${
              wordAnswer.includes(index)
                ? "bg-gray-500 opacity-30"
                : "bg-yellow-500 text-black active:scale-95"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex gap-2 min-h-[3.5rem] items-center">
        {wordAnswer.length === 0 && (
          <span className="opacity-60">Jouw woord verschijnt hier...</span>
        )}
        {wordAnswer.map((i, position) => (
          <div
            key={position}
            className="w-12 h-12 rounded-lg bg-blue-600 font-bold text-xl flex items-center justify-center"
          >
            {letters[i]}
          </div>
        ))}
      </div>

      {wordError && (
        <p className="text-red-300 font-bold">
          ❌ Dat is nog niet het juiste woord, probeer een andere volgorde!
        </p>
      )}

      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={removeLast}
          className="flex-1 bg-gray-600 rounded-xl p-4 font-bold"
        >
          ⌫ Wis laatste
        </button>
        <button
          onClick={check}
          className="flex-1 bg-green-600 rounded-xl p-4 font-bold"
        >
          ✅ Controleer
        </button>
      </div>
    </main>
  );
}
