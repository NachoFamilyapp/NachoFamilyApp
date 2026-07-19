"use client";

type Props = {
  value: number;
  max: number;
  color?: string;
};

export default function ProgressBar({
  value,
  max,
  color = "#22c55e",
}: Props) {
  const percentage = Math.min(
    100,
    Math.max(0, (value / max) * 100)
  );

  return (
    <div
      className="
        w-full
        h-5
        rounded-full
        bg-gray-300
        overflow-hidden
      "
    >
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${percentage}%`,
          background: color,
        }}
      />
    </div>
  );
}