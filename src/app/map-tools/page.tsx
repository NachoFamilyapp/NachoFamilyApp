"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

const MapToolsMap = dynamic(
  () => import("@/components/MapToolsMap"),
  {
    ssr: false,
  }
);

export default function MapToolsPage() {
  const [location, setLocation] =
    useState<[number, number]>([
      52.045,
      4.5,
    ]);

  const [gpsReady, setGpsReady] =
    useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS niet beschikbaar");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);

        setGpsReady(true);
      },
      (error) => {
        console.error(error);

        alert(
          "Locatie ophalen mislukt"
        );
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  const saveAsTestLocation =
    async () => {
      try {
        const gameCode =
          localStorage.getItem(
            "gameCode"
          );

        if (!gameCode) {
          alert(
            "Geen game gevonden"
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
            testPosition: {
              lat: location[0],
              lng: location[1],
            },
          }
        );

        alert(
          "Testlocatie opgeslagen"
        );
      } catch (error) {
        console.error(error);

        alert("Opslaan mislukt");
      }
    };

  return (
    <main className="min-h-screen bg-green-900 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-green-800 p-8">
          <h1 className="mb-6 text-4xl font-bold">
            🗺️ Map Tools
          </h1>

          <div className="mb-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={
                getCurrentLocation
              }
              className="rounded-xl bg-blue-600 p-4 font-bold"
            >
              📡 Gebruik Huidige Locatie
            </button>

            <button
              type="button"
              onClick={
                saveAsTestLocation
              }
              className="rounded-xl bg-green-600 p-4 font-bold"
            >
              💾 Opslaan als Testlocatie
            </button>
          </div>

          <div className="mb-6 rounded-xl bg-green-700 p-4">
            <div>
              GPS:{" "}
              {gpsReady
                ? "✅ Gereed"
                : "❌ Niet actief"}
            </div>

            <div>
              Latitude: {location[0]}
            </div>

            <div>
              Longitude: {location[1]}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl">
            <MapToolsMap
              location={location}
            />
          </div>
        </div>
      </div>
    </main>
  );
}