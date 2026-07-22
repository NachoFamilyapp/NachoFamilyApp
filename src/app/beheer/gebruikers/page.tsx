"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import PasswordGate from "@/components/PasswordGate";

import { UserService } from "@/lib/userService";
import { SpeurtochtService } from "@/lib/speurtochtService";
import { UserProfile } from "@/types/user";

const ADMIN_CODE = "5712";

export default function GebruikersBeheerPage() {
  return (
    <PasswordGate
      code={ADMIN_CODE}
      sessionKey="hoofdbeheer_ok"
      title="Gebruikers"
      backHref="/beheer"
    >
      <GebruikersPanel />
    </PasswordGate>
  );
}

function GebruikersPanel() {
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function refresh() {
    const list = await UserService.getAllUsers();
    setUsers(list);

    const entries = await Promise.all(
      list.map(async (u) => [u.uid, await SpeurtochtService.getUserScore(u.uid)] as const)
    );
    setScores(Object.fromEntries(entries));
  }

  useEffect(() => {
    // refresh() is async; state-updates gebeuren na een await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  function startEdit(user: UserProfile) {
    setEditingUid(user.uid);
    setEditName(user.name);
  }

  async function saveEdit(uid: string) {
    if (!editName.trim()) return;
    await UserService.renameUser(uid, editName.trim());
    setEditingUid(null);
    await refresh();
  }

  async function removeUser(uid: string, name: string) {
    if (!confirm(`Gebruiker "${name}" verwijderen? Dit kan niet ongedaan gemaakt worden.`)) {
      return;
    }
    await UserService.deleteUser(uid);
    await refresh();
  }

  return (
    <main className="min-h-screen text-white p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-2">👥</div>
          <h1 className="text-3xl font-bold">Gebruikers</h1>
          <p className="opacity-80 mt-1">
            {users ? `${users.length} gebruiker(s)` : "Laden..."}
          </p>
        </div>

        {users?.length === 0 && (
          <p className="text-center opacity-70">
            Nog niemand heeft een naam ingevuld in de app.
          </p>
        )}

        {users?.map((user) => (
          <Card key={user.uid} className="text-white">
            {editingUid === user.uid ? (
              <div className="flex flex-col gap-3">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(user.uid)}
                  className="w-full rounded-xl p-3 text-black bg-white text-lg font-bold"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(user.uid)}
                    className="flex-1 bg-green-600 rounded-xl p-3 font-bold"
                  >
                    ✅ Opslaan
                  </button>
                  <button
                    onClick={() => setEditingUid(null)}
                    className="flex-1 bg-gray-600 rounded-xl p-3 font-bold"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl shrink-0">
                  🙂
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{user.name}</div>
                  <div className="text-sm opacity-70">
                    Sinds {new Date(user.createdAt).toLocaleDateString("nl-NL")}
                    {" · "}🏆 {scores[user.uid] ?? 0} punten (Waar ben ik?)
                  </div>
                </div>
                <button
                  onClick={() => startEdit(user)}
                  className="bg-white/20 px-3 py-2 rounded-xl font-bold"
                >
                  ✏️
                </button>
                <button
                  onClick={() => removeUser(user.uid, user.name)}
                  className="bg-red-700 px-3 py-2 rounded-xl font-bold"
                >
                  🗑️
                </button>
              </div>
            )}
          </Card>
        ))}

        <button
          onClick={() => router.push("/beheer")}
          className="underline opacity-80 mx-auto mt-2"
        >
          ← Terug naar Hoofdbeheer
        </button>
      </div>
    </main>
  );
}
