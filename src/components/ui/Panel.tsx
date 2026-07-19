"use client";

import { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
};

export default function Panel({
  title,
  children,
}: Props) {
  return (
    <div
      className="
        rounded-[28px]
        bg-green-600/90
        shadow-xl
        p-5
        text-white
      "
    >
      {title && (
        <h2
          className="
            text-2xl
            font-bold
            mb-4
          "
        >
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}