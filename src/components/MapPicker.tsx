"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
  useMapEvents,
} from "react-leaflet";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Mode =
  | "area"
  | "redFlag"
  | "blueFlag"
  | "testPosition";

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (
    lat: number,
    lng: number
  ) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(
        e.latlng.lat,
        e.latlng.lng
      );
    },
  });

  return null;
}

export default function MapPicker() {
  const router =
    useRouter();

  const [mode, setMode] =
    useState<Mode>("area");

  const [points, setPoints] =
    useState<
      [number, number][]
    >([]);

  const [redFlag, setRedFlag] =
    useState<
      [number, number] | null
    >(null);

  const [blueFlag, setBlueFlag] =
    useState<
      [number, number] | null
    >(null);

  const [testPosition, setTestPosition] =
    useState<
      [number, number] | null
    >(null);

  const handleMapClick =
    (
      lat: number,
      lng: number
    ) => {
      if (mode === "area") {
        setPoints((prev) => [
          ...prev,
          [lat, lng],
        ]);
      }

      if (
        mode === "redFlag"
      ) {
        setRedFlag([
          lat,
          lng,
        ]);
      }

      if (
        mode ===
        "blueFlag"
      ) {
        setBlueFlag([
          lat,
          lng,
        ]);
      }

      if (
        mode ===
        "testPosition"
      ) {
        setTestPosition([
          lat,
          lng,
        ]);
      }
    };

  const saveArea =
    async () => {
      try {
        const gameCode =
          localStorage.getItem(
            "gameCode"
          );

        if (!gameCode) {
          alert(
            "Geen gamecode gevonden"
          );
          return;
        }

        if (
          points.length < 3
        ) {
          alert(
            "Minimaal 3 punten nodig"
          );
          return;
        }

        if (!redFlag) {
          alert(
            "Plaats eerst een rode vlag"
          );
          return;
        }

        if (!blueFlag) {
          alert(
            "Plaats eerst een blauwe vlag"
          );
          return;
        }

        const gameRef = doc(
          db,
          "games",
          gameCode
        );

        await updateDoc(
          gameRef,
          {
            playArea:
              points.map(
                ([
                  lat,
                  lng,
                ]) => ({
                  lat,
                  lng,
                })
              ),

            redFlag: {
              lat:
                redFlag[0],
              lng:
                redFlag[1],
            },

            blueFlag: {
              lat:
                blueFlag[0],
              lng:
                blueFlag[1],
            },

            testPosition:
              testPosition
                ? {
                    lat:
                      testPosition[0],
                    lng:
                      testPosition[1],
                  }
                : null,
          }
        );

        alert(
          "Speelveld opgeslagen"
        );

        router.push("/");
      } catch (
        error
      ) {
        console.error(
          error
        );

        alert(
          "Opslaan mislukt"
        );
      }
    };

  const clearPoints =
    () => {
      setPoints([]);
    };

  const clearPlayArea =
    async () => {
      const gameCode =
        localStorage.getItem(
          "gameCode"
        );

      if (!gameCode)
        return;

      const gameRef = doc(
        db,
        "games",
        gameCode
      );

      await updateDoc(
        gameRef,
        {
          playArea: [],
        }
      );

      setPoints([]);
    };

  const clearFlags =
    async () => {
      const gameCode =
        localStorage.getItem(
          "gameCode"
        );

      if (!gameCode)
        return;

      const gameRef = doc(
        db,
        "games",
        gameCode
      );

      await updateDoc(
        gameRef,
        {
          redFlag: null,
          blueFlag: null,
        }
      );

      setRedFlag(null);
      setBlueFlag(null);
    };

  const clearTestPosition =
    async () => {
      const gameCode =
        localStorage.getItem(
          "gameCode"
        );

      if (!gameCode)
        return;

      const gameRef = doc(
        db,
        "games",
        gameCode
      );

      await updateDoc(
        gameRef,
        {
          testPosition:
            null,
        }
      );

      setTestPosition(
        null
      );
    };

  const clearAll =
    async () => {
      const gameCode =
        localStorage.getItem(
          "gameCode"
        );

      if (!gameCode)
        return;

      const gameRef = doc(
        db,
        "games",
        gameCode
      );

      await updateDoc(
        gameRef,
        {
          playArea: [],
          redFlag: null,
          blueFlag: null,
          testPosition:
            null,
        }
      );

      setPoints([]);
      setRedFlag(null);
      setBlueFlag(null);
      setTestPosition(
        null
      );
    };

  return (
    <div>
      <div className="bg-green-700 rounded-xl p-4 mb-4">
        <div>
          Speelgebied:
          {" "}
          {points.length >= 3
            ? "✅"
            : "❌"}
        </div>

        <div>
          Rode Vlag:
          {" "}
          {redFlag
            ? "✅"
            : "❌"}
        </div>

        <div>
          Blauwe Vlag:
          {" "}
          {blueFlag
            ? "✅"
            : "❌"}
        </div>

        <div>
          Testlocatie:
          {" "}
          {testPosition
            ? "✅"
            : "❌"}
        </div>

        <div>
          Modus:
          {" "}
          {mode}
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <button
          onClick={() =>
            setMode(
              "area"
            )
          }
          className="bg-blue-600 p-3 rounded-xl"
        >
          🗺️ Speelgebied
        </button>

        <button
          onClick={() =>
            setMode(
              "redFlag"
            )
          }
          className="bg-red-600 p-3 rounded-xl"
        >
          🚩 Rode Vlag
        </button>

        <button
          onClick={() =>
            setMode(
              "blueFlag"
            )
          }
          className="bg-blue-800 p-3 rounded-xl"
        >
          🚩 Blauwe Vlag
        </button>

        <button
          onClick={() =>
            setMode(
              "testPosition"
            )
          }
          className="bg-purple-600 p-3 rounded-xl"
        >
          📍 Test Locatie
        </button>
      </div>

      <div
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <MapContainer
          center={[
            52.045,
            4.5,
          ]}
          zoom={17}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            onMapClick={
              handleMapClick
            }
          />

          {points.map(
            (
              point,
              index
            ) => (
              <Marker
                key={index}
                position={
                  point
                }
              />
            )
          )}

          {points.length >=
            3 && (
            <Polygon
              positions={
                points
              }
            />
          )}

          {redFlag && (
            <Marker
              position={
                redFlag
              }
            >
              <Popup>
                🚩 Rode Vlag
              </Popup>
            </Marker>
          )}

          {blueFlag && (
            <Marker
              position={
                blueFlag
              }
            >
              <Popup>
                🚩 Blauwe Vlag
              </Popup>
            </Marker>
          )}

          {testPosition && (
            <Marker
              position={
                testPosition
              }
            >
              <Popup>
                📍 Test Locatie
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={
            saveArea
          }
          className="bg-green-600 px-6 py-3 rounded-xl"
        >
          💾 Opslaan
        </button>

        <button
          onClick={
            clearPoints
          }
          className="bg-yellow-600 px-6 py-3 rounded-xl"
        >
          🧹 Punten Wissen
        </button>

        <button
          onClick={
            clearPlayArea
          }
          className="bg-orange-600 px-6 py-3 rounded-xl"
        >
          🗺️ Speelgebied Wissen
        </button>

        <button
          onClick={
            clearFlags
          }
          className="bg-purple-600 px-6 py-3 rounded-xl"
        >
          🚩 Vlaggen Wissen
        </button>

        <button
          onClick={
            clearTestPosition
          }
          className="bg-indigo-600 px-6 py-3 rounded-xl"
        >
          📍 Testlocatie Wissen
        </button>

        <button
          onClick={
            clearAll
          }
          className="bg-red-700 px-6 py-3 rounded-xl"
        >
          💥 Alles Wissen
        </button>
      </div>
    </div>
  );
}