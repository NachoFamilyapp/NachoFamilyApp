"use client";

export const MORSE_SNELHEDEN = [
  { label: "🐢 Zeer traag", eenheid: 320 },
  { label: "🐌 Traag", eenheid: 240 },
  { label: "🚶 Normaal", eenheid: 180 },
  { label: "🏃 Snel", eenheid: 120 },
  { label: "⚡ Zeer snel", eenheid: 80 },
];

export function niveauVoorEenheid(eenheid: number): number {
  let dichtsteIndex = 2;
  let kleinsteVerschil = Infinity;

  MORSE_SNELHEDEN.forEach((s, i) => {
    const verschil = Math.abs(s.eenheid - eenheid);
    if (verschil < kleinsteVerschil) {
      kleinsteVerschil = verschil;
      dichtsteIndex = i;
    }
  });

  return dichtsteIndex;
}

type Props = {
  niveau: number; // 0-4
  onChange: (niveau: number) => void;
};

export default function SnelheidSlider({ niveau, onChange }: Props) {
  return (
    <div>
      <label className="block font-bold mb-2 text-center">
        Snelheid: {MORSE_SNELHEDEN[niveau].label}
      </label>
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={niveau}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs opacity-70 mt-1">
        <span>Traag</span>
        <span>Snel</span>
      </div>
    </div>
  );
}
