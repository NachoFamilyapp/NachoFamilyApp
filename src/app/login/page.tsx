"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [bezig, setBezig] = useState(false);
  const [foutmelding, setFoutmelding] = useState("");

  async function inloggenMetWachtwoord() {
    setFoutmelding("");
    setBezig(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, wachtwoord }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFoutmelding(data.error ?? "Inloggen mislukt.");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error(error);
      setFoutmelding("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setBezig(false);
    }
  }

  async function inloggenMetFaceId() {
    if (!username.trim()) {
      setFoutmelding("Vul eerst je gebruikersnaam in.");
      return;
    }

    setFoutmelding("");
    setBezig(true);
    try {
      const optiesResponse = await fetch("/api/auth/webauthn/login-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const optiesData = await optiesResponse.json();

      if (!optiesResponse.ok) {
        setFoutmelding(optiesData.error ?? "Face ID niet beschikbaar voor deze gebruiker.");
        return;
      }

      const assertie = await startAuthentication({ optionsJSON: optiesData.opties });

      const verifyResponse = await fetch("/api/auth/webauthn/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: optiesData.uid, response: assertie }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setFoutmelding(verifyData.error ?? "Face ID-verificatie mislukt.");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error(error);
      setFoutmelding("Face ID werd geannuleerd of is mislukt.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🤝</div>
          <h1 className="text-3xl font-bold">Promises</h1>
          <p className="opacity-80 mt-1">Log in om verder te gaan</p>
        </div>

        <label className="block font-bold mb-1 text-sm">Gebruikersnaam</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl p-3 text-black bg-white mb-4"
          placeholder="bijv. papa"
        />

        <label className="block font-bold mb-1 text-sm">Wachtwoord</label>
        <input
          type="password"
          value={wachtwoord}
          onChange={(e) => setWachtwoord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && inloggenMetWachtwoord()}
          className="w-full rounded-xl p-3 text-black bg-white mb-4"
          placeholder="••••••••"
        />

        {foutmelding && (
          <p className="text-red-300 text-sm mb-4 text-center">{foutmelding}</p>
        )}

        <button
          onClick={inloggenMetWachtwoord}
          disabled={bezig}
          className="w-full bg-green-600 disabled:bg-gray-500 rounded-xl p-3 font-bold mb-3"
        >
          {bezig ? "Bezig..." : "Inloggen"}
        </button>

        <button
          onClick={inloggenMetFaceId}
          disabled={bezig}
          className="w-full bg-white/20 disabled:bg-gray-500 rounded-xl p-3 font-bold"
        >
          🔓 Ontgrendel met Face ID
        </button>
      </div>
    </main>
  );
}
