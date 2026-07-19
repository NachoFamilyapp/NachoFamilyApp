"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        bg-white/20
        backdrop-blur-md
        rounded-[32px]
        shadow-2xl
        border-4
        border-white/30
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}