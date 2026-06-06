"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
} from "react-leaflet";
import { useEffect, useState } from "react";

export default function GameField() {
  const [playerPosition, setPlayerPosition] =
    useState<[number, number] | null>(null);

  const [playArea, setPlayArea] =
    useState<[number, number][]>([]);

  const [redFlag, setRedFlag] =
    useState<[number, number] | null>(null);

  const [blueFlag, setBlueFlag] =
    useState<[number, number] | null>(null);

  useEffect(() => {
    const area = JSON.parse(
      localStorage.getItem("playArea") || "[]"
    );

    const red = JSON.parse(
      localStorage.getItem("redFlag") || "null"
    );

    const blue = JSON.parse(
      localStorage.getItem("blueFlag") || "null"
    );

    setPlayArea(area);
    setRedFlag(red);
    setBlueFlag(blue);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPlayerPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      }
    );
  }, []);

  if (!playerPosition) {
    return (
      <div className="text-xl">
        GPS laden...
      </div>
    );
  }

  return (
    <div
      style={{
        height: "600px",
        width: "100%",
      }}
    >
      <MapContainer
        center={playerPosition}
        zoom={18}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={playerPosition}>
          <Popup>
            📍 Jij
          </Popup>
        </Marker>

        {playArea.length >= 3 && (
          <Polygon positions={playArea} />
        )}

        {redFlag && (
          <Marker position={redFlag}>
            <Popup>
              🚩 Rode Vlag
            </Popup>
          </Marker>
        )}

        {blueFlag && (
          <Marker position={blueFlag}>
            <Popup>
              🚩 Blauwe Vlag
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}