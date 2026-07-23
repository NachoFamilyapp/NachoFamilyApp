"use client";

import { useEffect, useRef, useState } from "react";
import { FlashStep } from "@/lib/morse";
import { speelTreinToon } from "@/lib/trainSound";

type Props = {
  sequence: FlashStep[];
  playToken: number; // verhoog dit getal om (opnieuw) af te spelen
  onDone?: () => void;
  geluidAan?: boolean;
};

export default function MorseLight({
  sequence,
  playToken,
  onDone,
  geluidAan,
}: Props) {
  const [isOn, setIsOn] = useState(false);
  const [lastFinishedToken, setLastFinishedToken] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playing = playToken > 0 && playToken !== lastFinishedToken;

  useEffect(() => {
    if (playToken === 0) return;

    let cancelled = false;

    function playFrom(index: number) {
      if (cancelled) return;

      if (index >= sequence.length) {
        setIsOn(false);
        setLastFinishedToken(playToken);
        onDone?.();
        return;
      }

      const step = sequence[index];
      setIsOn(step.on);

      if (step.on) {
        if (navigator.vibrate) {
          navigator.vibrate(step.duration);
        }
        if (geluidAan) {
          speelTreinToon(step.duration);
        }
      }

      timeoutRef.current = setTimeout(() => playFrom(index + 1), step.duration);
    }

    playFrom(0);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playToken]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`w-48 h-48 rounded-full transition-all duration-75 ${
          isOn
            ? "bg-yellow-300 shadow-[0_0_80px_30px_rgba(253,224,71,0.8)]"
            : "bg-gray-700"
        }`}
      />
      {playing && (
        <p className="text-sm opacity-80">📡 Bezig met seinen...</p>
      )}
    </div>
  );
}
