"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  icon?: string;
  color?:
    | "green"
    | "blue"
    | "red"
    | "yellow"
    | "purple";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
};

const colors = {
  green:
    "bg-green-500 active:bg-green-600",

  blue:
    "bg-blue-500 active:bg-blue-600",

  red:
    "bg-red-500 active:bg-red-600",

  yellow:
    "bg-yellow-500 active:bg-yellow-600",

  purple:
    "bg-purple-500 active:bg-purple-600",
};

export default function BigButton({

  children,

  icon,

  color = "green",

  onClick,

  disabled,

  fullWidth = true,

}: Props) {

  return (

    <button

      disabled={disabled}

      onClick={onClick}

      className={`

      ${colors[color]}

      ${fullWidth ? "w-full" : ""}

      rounded-3xl

      shadow-xl

      active:scale-95

      transition-all

      duration-150

      h-20

      flex

      items-center

      justify-center

      gap-4

      text-2xl

      font-bold

      text-white

      disabled:opacity-40

      `}

    >

      {icon && (

        <span className="text-4xl">

          {icon}

        </span>

      )}

      {children}

    </button>

  );

}