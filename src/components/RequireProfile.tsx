"use client";

import { useState } from "react";

import { useUser } from "@/components/UserProvider";
import Card from "@/components/ui/Card";
import BigButton from "@/components/ui/BigButton";

type Props = {
  children: React.ReactNode;
};

export default function RequireProfile({ children }: Props) {
  const { profile, loading, setName } = useUser();
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Laden...
      </main>
    );
  }

  if (profile) {
    return <>{children}</>;
  }

  async function confirm() {
    if (!nameInput.trim()) return;

    setSaving(true);
    try {
      await setName(nameInput.trim());
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <Card className="w-full max-w-sm text-white text-center">
        <div className="text-5xl mb-4">👋</div>
        <h1 className="text-2xl font-bold mb-2">Welkom!</h1>
        <p className="opacity-90 mb-4">
          Vul je naam in. Alles wat je speelt, wordt onder jouw eigen naam
          opgeslagen.
        </p>

        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && confirm()}
          placeholder="Jouw naam"
          className="w-full rounded-xl p-4 text-black bg-white mb-4 text-center text-xl"
        />

        <BigButton icon="✅" color="green" onClick={confirm} disabled={saving}>
          {saving ? "Bezig..." : "Start"}
        </BigButton>
      </Card>
    </main>
  );
}
