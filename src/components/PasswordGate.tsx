"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";

type Props = {
  code: string;
  sessionKey: string;
  title: string;
  backHref: string;
  children: ReactNode;
};

export default function PasswordGate({
  code,
  sessionKey,
  title,
  backHref,
  children,
}: Props) {
  const router = useRouter();

  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(sessionKey) === "true";
  });
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);

  function checkCode() {
    if (codeInput === code) {
      sessionStorage.setItem(sessionKey, "true");
      setUnlocked(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <Card className="w-full max-w-sm text-white text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="opacity-80 mb-4">Voer de toegangscode in</p>

        <input
          type="password"
          inputMode="numeric"
          value={codeInput}
          onChange={(e) => {
            setCodeInput(e.target.value);
            setCodeError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && checkCode()}
          placeholder="••••"
          className="w-full rounded-xl p-4 text-black bg-white border-2 border-white/50 focus:border-purple-400 outline-none text-center text-3xl tracking-[0.5em] mb-4"
        />

        {codeError && <p className="text-red-300 mb-4">❌ Onjuiste code</p>}

        <BigButton icon="🔓" color="purple" onClick={checkCode}>
          Openen
        </BigButton>

        <button
          onClick={() => router.push(backHref)}
          className="underline opacity-80 mt-4 block mx-auto"
        >
          ← Terug
        </button>
      </Card>
    </main>
  );
}
