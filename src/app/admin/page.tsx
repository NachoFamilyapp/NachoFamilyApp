"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const MapPicker = dynamic(
  () => import("@/components/MapPicker"),
  {
    ssr: false,
  }
);

export default function AdminPage() {
  const [gameName, setGameName] =
    useState("Capture The Flag");

  const [playerCount, setPlayerCount] =
    useState(4);

  const [teamCount, setTeamCount] =
    useState(2);

  useEffect(() => {
    const settings = JSON.parse(
      localStorage.getItem(
        "gameSettings"
      ) || "{}"
    );

    if (settings.gameName)
      setGameName(settings.gameName);

    if (settings.playerCount)
      setPlayerCount(
        settings.playerCount
      );

    if (settings.teamCount)
      setTeamCount(
        settings.teamCount
      );
  }, []);

  const saveSettings = () => {
    localStorage.setItem(
      "gameSettings",
      JSON.stringify({
        gameName,
        playerCount,
        teamCount,
      })
    );

    alert("Instellingen opgeslagen");
  };

  return (
    <main className="min-h-screen bg-green-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">
        NachoFamilyApp Beheer
      </h1>

      <div className="bg-green-800 p-6 rounded-xl mb-6">
        <h2 className="text-2xl mb-4">
          Spel Instellingen
        </h2>

        <input
          type="text"
          value={gameName}
          onChange={(e) =>
            setGameName(
              e.target.value
            )
          }
          className="text-black p-2 rounded w-full mb-4"
        />

        <label>
          Aantal Spelers
        </label>

        <select
          value={playerCount}
          onChange={(e) =>
            setPlayerCount(
              Number(
                e.target.value
              )
            )
          }
          className="text-black p-2 rounded w-full mb-4"
        >
          <option value={2}>
            2
          </option>
          <option value={4}>
            4
          </option>
          <option value={6}>
            6
          </option>
          <option value={8}>
            8
          </option>
          <option value={10}>
            10
          </option>
          <option value={12}>
            12
          </option>
          <option value={16}>
            16
          </option>
          <option value={20}>
            20
          </option>
        </select>

        <label>
          Aantal Teams
        </label>

        <select
          value={teamCount}
          onChange={(e) =>
            setTeamCount(
              Number(
                e.target.value
              )
            )
          }
          className="text-black p-2 rounded w-full mb-4"
        >
          <option value={2}>
            2
          </option>
          <option value={3}>
            3
          </option>
          <option value={4}>
            4
          </option>
        </select>

        <button
          onClick={saveSettings}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          Instellingen Opslaan
        </button>
      </div>

      <h2 className="text-2xl mb-4">
        Speelgebied
      </h2>

      <MapPicker />
    </main>
  );
}