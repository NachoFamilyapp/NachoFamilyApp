"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

export default function GameMap() {
  const [position, setPosition] =
    useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
      },
      () => {
        alert("GPS niet beschikbaar");
      }
    );
  }, []);

  if (!position) {
    return (
      <div className="text-xl">
        GPS laden...
      </div>
    );
  }

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
      }}
    >
      <MapContainer
        center={position}
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

        <Marker position={position}>
          <Popup>
            Jij bent hier
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}