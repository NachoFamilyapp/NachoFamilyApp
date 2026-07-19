"use client";

type Props = {
  color:
    | "green"
    | "red"
    | "yellow"
    | "blue";

  children: React.ReactNode;
};

const colors = {
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
};

export default function StatusBadge({
  color,
  children,
}: Props) {
  return (
    <div
      className={`
        ${colors[color]}
        px-4
        py-2
        rounded-full
        font-bold
        text-white
        inline-flex
        items-center
      `}
    >
      {children}
    </div>
  );
}