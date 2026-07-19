"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
  useMapEvents,
} from "react-leaflet";

import GameService from "@/lib/gameService";
import { FirebaseGame } from "@/lib/firebaseGame";
import { Flag } from "@/types/game";

type Mode = "area" | "redFlag" | "blueFlag";

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function MapPicker() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("area");

  const [points, setPoints] = useState<[number, number][]>([]);

  const [redFlag, setRedFlag] = useState<[number, number] | null>(null);
  const [blueFlag, setBlueFlag] = useState<[number, number] | null>(null);

  const gameCode = GameService.getStoredGameCode();

  useEffect(() => {
    if (!gameCode) return;

    let cancelled = false;

    GameService.getGame(gameCode).then((game) => {
      if (!game || cancelled) return;

      if (game.playArea.length > 0) {
        setPoints(game.playArea.map((p) => [p.lat, p.lng]));
      }

      const red = game.flags.find((f) => f.team === "red");
      const blue = game.flags.find((f) => f.team === "blue");

      if (red) setRedFlag([red.basePosition.lat, red.basePosition.lng]);
      if (blue) setBlueFlag([blue.basePosition.lat, blue.basePosition.lng]);
    });

    return () => {
      cancelled = true;
    };
  }, [gameCode]);

  const handleMapClick = (lat: number, lng: number) => {
    if (mode === "area") {
      setPoints((prev) => [...prev, [lat, lng]]);
    }

    if (mode === "redFlag") {
      setRedFlag([lat, lng]);
    }

    if (mode === "blueFlag") {
      setBlueFlag([lat, lng]);
    }
  };

  const saveArea = async () => {
    try {
      if (!gameCode) {
        alert("Geen gamecode gevonden");
        return;
      }

      if (points.length < 3) {
        alert("Minimaal 3 punten nodig voor het speelgebied");
        return;
      }

      if (!redFlag) {
        alert("Plaats eerst een rode vlag");
        return;
      }

      if (!blueFlag) {
        alert("Plaats eerst een blauwe vlag");
        return;
      }

      await FirebaseGame.setPlayArea(
        gameCode,
        points.map(([lat, lng]) => ({ lat, lng }))
      );

      const flags: Flag[] = [
        {
          id: "red",
          team: "red",
          position: { lat: redFlag[0], lng: redFlag[1] },
          basePosition: { lat: redFlag[0], lng: redFlag[1] },
          carriedBy: null,
          captured: false,
        },
        {
          id: "blue",
          team: "blue",
          position: { lat: blueFlag[0], lng: blueFlag[1] },
          basePosition: { lat: blueFlag[0], lng: blueFlag[1] },
          carriedBy: null,
          captured: false,
        },
      ];

      await FirebaseGame.setFlags(gameCode, flags);

      alert("✅ Speelgebied en vlaggen opgeslagen");

      router.push("/lobby");
    } catch (error) {
      console.error(error);
      alert("Opslaan mislukt");
    }
  };

  const clearPoints = () => {
    setPoints([]);
  };

  const clearAll = async () => {
    if (!gameCode) return;

    await FirebaseGame.setPlayArea(gameCode, []);
    await FirebaseGame.setFlags(gameCode, []);

    setPoints([]);
    setRedFlag(null);
    setBlueFlag(null);
  };

  return (
    <div>
      <div className="bg-green-700 rounded-xl p-4 mb-4">
        <div>Speelgebied: {points.length >= 3 ? "✅" : "❌"}</div>
        <div>Rode Vlag: {redFlag ? "✅" : "❌"}</div>
        <div>Blauwe Vlag: {blueFlag ? "✅" : "❌"}</div>
        <div>Modus: {mode}</div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <button
          onClick={() => setMode("area")}
          className={`p-3 rounded-xl ${mode === "area" ? "bg-blue-500 ring-2 ring-white" : "bg-blue-700"}`}
        >
          🗺️ Speelgebied ({points.length} punten)
        </button>

        <button
          onClick={() => setMode("redFlag")}
          className={`p-3 rounded-xl ${mode === "redFlag" ? "bg-red-500 ring-2 ring-white" : "bg-red-700"}`}
        >
          🚩 Rode Vlag plaatsen
        </button>

        <button
          onClick={() => setMode("blueFlag")}
          className={`p-3 rounded-xl ${mode === "blueFlag" ? "bg-blue-500 ring-2 ring-white" : "bg-blue-900"}`}
        >
          🚩 Blauwe Vlag plaatsen
        </button>
      </div>

      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={[52.045, 4.5]}
          zoom={17}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onMapClick={handleMapClick} />

          {points.map((point, index) => (
            <Marker key={index} position={point} />
          ))}

          {points.length >= 3 && <Polygon positions={points} />}

          {redFlag && (
            <Marker position={redFlag}>
              <Popup>🚩 Rode Vlag basis</Popup>
            </Marker>
          )}

          {blueFlag && (
            <Marker position={blueFlag}>
              <Popup>🚩 Blauwe Vlag basis</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <button onClick={saveArea} className="bg-green-600 px-6 py-3 rounded-xl font-bold">
          💾 Opslaan &amp; terug naar lobby
        </button>

        <button onClick={clearPoints} className="bg-yellow-600 px-6 py-3 rounded-xl">
          🧹 Speelgebied-punten wissen
        </button>

        <button onClick={clearAll} className="bg-red-700 px-6 py-3 rounded-xl">
          💥 Alles wissen (opgeslagen + lokaal)
        </button>
      </div>
    </div>
  );
}
