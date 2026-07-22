"use client";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

type Props = {
  onLetter: (letter: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function OnScreenKeyboard({
  onLetter,
  onBackspace,
  onSubmit,
  disabled,
}: Props) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-2 select-none">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {[...row].map((letter) => (
            <button
              key={letter}
              onClick={() => onLetter(letter)}
              disabled={disabled}
              className="flex-1 max-w-10 h-12 rounded-lg bg-white/20 disabled:opacity-40 font-bold text-lg"
            >
              {letter}
            </button>
          ))}
        </div>
      ))}

      <div className="flex justify-center gap-2 mt-1">
        <button
          onClick={onBackspace}
          disabled={disabled}
          className="flex-1 h-12 rounded-lg bg-white/20 disabled:opacity-40 font-bold text-lg"
        >
          ⌫
        </button>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="flex-[2] h-12 rounded-lg bg-green-600 disabled:opacity-40 font-bold text-lg"
        >
          ✅ Controleer
        </button>
      </div>
    </div>
  );
}
