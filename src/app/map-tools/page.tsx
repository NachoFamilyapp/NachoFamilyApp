"use client";

import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function MapToolsPage() {
  const [location, setLocation] =
    useState<
      [number, number]
    >([
      52.045,
      4.5,
    ]);

  const [gpsReady, setGpsReady] =
    useState(false);

  const getCurrentLocation =
    () => {
      if (
        !navigator.geolocation
      ) {
        alert(
          "GPS niet beschikbaar"
        );
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
          console.error(
            error
          );

          alert(
            "Locatie ophalen mislukt"
          );
        },
        {
          enableHighAccuracy:
            true,
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
              lat:
                location[0],
              lng:
                location[1],
            },
          }
        );

        alert(
          "Testlocatie opgeslagen"
        );
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

  return (
    <main className="min-h-screen bg-green-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-green-800 rounded-3xl p-8">
          <h1 className="text-4xl font-bold mb-6">
            🗺️ Map Tools
          </h1>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={
                getCurrentLocation
              }
              className="bg-blue-600 p-4 rounded-xl font-bold"
            >
              📡 Gebruik Huidige Locatie
            </button>

            <button
              onClick={
                saveAsTestLocation
              }
              className="bg-green-600 p-4 rounded-xl font-bold"
            >
              💾 Opslaan als Testlocatie
            </button>
          </div>

          <div className="bg-green-700 rounded-xl p-4 mb-6">
            <div>
              GPS:
              {" "}
              {gpsReady
                ? "✅ Gereed"
                : "❌ Niet actief"}
            </div>

            <div>
              Latitude:
              {" "}
              {location[0]}
            </div>

            <div>
              Longitude:
              {" "}
              {location[1]}
            </div>
          </div>

          <div
            style={{
              height: "600px",
              width: "100%",
            }}
          >
            <MapContainer
              center={
                location
              }
              zoom={18}
              style={{
                height:
                  "100%",
                width:
                  "100%",
              }}
            >
              <TileLayer
                attribution="OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                position={
                  location
                }
              >
                <Popup>
                  📍 Mijn
                  Locatie
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </main>
  );
}