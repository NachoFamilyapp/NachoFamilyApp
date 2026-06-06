"use client";

import { useEffect, useState } from "react";

export default function GamePage() {
  const [message, setMessage] =
    useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;

        const redFlag = JSON.parse(
          localStorage.getItem(
            "redFlag"
          ) || "null"
        );

        const blueFlag = JSON.parse(
          localStorage.getItem(
            "blueFlag"
          ) || "null"
        );

        const distance = (
          aLat: number,
          aLng: number,
          bLat: number,
          bLng: number
        ) => {
          return Math.sqrt(
            Math.pow(
              aLat - bLat,
              2
            ) +
              Math.pow(
                aLng - bLng,
                2
              )
          );
        };

        if (
          redFlag &&
          distance(
            lat,
            lng,
            redFlag[0],
            redFlag[1]
          ) < 0.0001
        ) {
          setMessage(
            "🚩 Rode vlag gevonden!"
          );
        }

        if (
          blueFlag &&
          distance(
            lat,
            lng,
            blueFlag[0],
            blueFlag[1]
          ) < 0.0001
        ) {
          setMessage(
            "🚩 Blauwe vlag gevonden!"
          );
        }
      }
    );
  }, []);

  return (
    <main className="min-h-screen bg-green-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">
        Capture The Flag
      </h1>

      <div className="bg-green-800 p-6 rounded-xl">
        {message ||
          "Zoek de vlag"}
      </div>
    </main>
  );
}