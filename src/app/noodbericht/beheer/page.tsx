"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import PasswordGate from "@/components/PasswordGate";
import MorseLight from "@/components/morse/MorseLight";

import { NoodberichtService } from "@/lib/noodberichtService";
import { UserService } from "@/lib/userService";
import { textToFlashSequence } from "@/lib/morse";
import { UserProfile } from "@/types/user";

const ADMIN_CODE = "5712";

export default function NoodberichtBeheerPage() {
  return (
    <PasswordGate
      code={ADMIN_CODE}
      sessionKey="noodbericht_admin_ok"
      title="Beheer Noodbericht"
      backHref="/"
    >
      <NoodberichtBeheerPanel />
    </PasswordGate>
  );
}

function NoodberichtBeheerPanel() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState<"alle" | "specifiek">("alle");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUids, setSelectedUids] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [playToken, setPlayToken] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // getAllUsers() is async; state-update gebeurt na een await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    UserService.getAllUsers().then(setUsers);
  }, []);

  const cleanMessage = message.trim().toUpperCase();
  const sequence = textToFlashSequence(cleanMessage);

  function toggleUser(uid: string) {
    setSelectedUids((prev) =>
      prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]
    );
  }

  async function verstuur() {
    if (!cleanMessage) return;

    if (targetType === "specifiek" && selectedUids.length === 0) {
      alert("Kies minimaal één gebruiker, of kies 'Alle gebruikers'.");
      return;
    }

    setSending(true);
    try {
      await NoodberichtService.stuurBericht(
        cleanMessage,
        targetType,
        targetType === "alle" ? [] : selectedUids
      );
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Versturen mislukt");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen text-white p-6">
      <div className="max-w-md mx-auto flex flex-col gap-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">🚨</div>
          <h1 className="text-3xl font-bold">Beheer Noodbericht</h1>
          <p className="opacity-80 mt-1">
            Stuur een moorse noodbericht naar alle spelers, of alleen naar
            gekozen spelers.
          </p>
        </div>

        <Card className="text-white">
          <label className="block font-bold mb-2">Bericht</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPaste={(e) => {
              // Standaard plak-gedrag werkt al in een textarea; dit
              // zorgt er alleen voor dat geplakte tekst niet vastloopt
              // op rare opmaak/regeleindes uit andere apps.
              const pasted = e.clipboardData.getData("text");
              if (pasted.includes("\n")) {
                e.preventDefault();
                setMessage((prev) => prev + pasted.replace(/\s+/g, " "));
              }
            }}
            placeholder="Typ hier of plak tekst vanuit een andere app..."
            rows={4}
            className="w-full rounded-xl p-3 text-black bg-white mb-2 text-lg"
          />

          {cleanMessage && (
            <p className="text-sm opacity-80 mb-4">
              {cleanMessage.length} tekens
            </p>
          )}

          <div className="flex justify-center mb-4">
            <MorseLight sequence={sequence} playToken={playToken} />
          </div>

          <button
            onClick={() => setPlayToken((t) => t + 1)}
            disabled={!cleanMessage}
            className="w-full bg-blue-600 disabled:bg-gray-500 rounded-xl p-3 font-bold mb-4"
          >
            ▶️ Test hier
          </button>

          <label className="block font-bold mb-2">Naar wie?</label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setTargetType("alle")}
              className={`flex-1 p-3 rounded-xl font-bold ${
                targetType === "alle" ? "bg-green-600" : "bg-white/20"
              }`}
            >
              👥 Alle gebruikers
            </button>
            <button
              onClick={() => setTargetType("specifiek")}
              className={`flex-1 p-3 rounded-xl font-bold ${
                targetType === "specifiek" ? "bg-green-600" : "bg-white/20"
              }`}
            >
              🎯 Specifieke gebruikers
            </button>
          </div>

          {targetType === "specifiek" && (
            <div className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto">
              {users.length === 0 && (
                <p className="opacity-70 text-sm">Nog geen gebruikers bekend.</p>
              )}

              {users.map((u) => (
                <label
                  key={u.uid}
                  className="flex items-center gap-3 bg-white/10 rounded-xl p-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedUids.includes(u.uid)}
                    onChange={() => toggleUser(u.uid)}
                    className="w-5 h-5"
                  />
                  <span className="font-bold">{u.name}</span>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={verstuur}
            disabled={!cleanMessage || sending}
            className="w-full bg-red-600 disabled:bg-gray-500 rounded-xl p-4 font-bold text-lg"
          >
            {sending ? "Bezig..." : "🚨 Verstuur noodbericht"}
          </button>

          {sent && (
            <p className="text-green-300 font-bold text-center mt-3">
              ✅ Verstuurd!
            </p>
          )}
        </Card>

        <button
          onClick={() => router.push("/")}
          className="underline opacity-80 mx-auto mt-2"
        >
          🏠 Terug naar Home
        </button>
      </div>
    </main>
  );
}
