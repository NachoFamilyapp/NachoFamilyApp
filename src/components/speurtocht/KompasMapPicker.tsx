"use client";

import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import { SpeurtochtCheckpoint } from "@/types/speurtocht";

type Props = {
  checkpoints: SpeurtochtCheckpoint[];
  centerLat: number;
  centerLng: number;
  onSetLocation: (id: string, lat: number, lng: number) => void;
};

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

export default function KompasMapPicker({
  checkpoints,
  centerLat,
  centerLng,
  onSetLocation,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(
    checkpoints[0]?.id ?? null
  );

  const withLocation = checkpoints.filter(
    (cp) => cp.lat !== null && cp.lng !== null
  );

  const mapCenter: [number, number] =
    withLocation.length > 0
      ? [
          withLocation.reduce((sum, cp) => sum + cp.lat!, 0) /
            withLocation.length,
          withLocation.reduce((sum, cp) => sum + cp.lng!, 0) /
            withLocation.length,
        ]
      : [centerLat, centerLng];

  function handleMapClick(lat: number, lng: number) {
    if (!activeId) return;
    onSetLocation(activeId, lat, lng);
  }

  return (
    <div>
      <p className="text-sm opacity-90 mb-3">
        Kies hieronder een opdracht, tik daarna op de kaart om het punt te
        zetten. Je kunt inzoomen en slepen zoals op elke kaart.
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {checkpoints.map((cp, index) => (
          <button
            key={cp.id}
            onClick={() => setActiveId(cp.id)}
            className={`px-3 py-2 rounded-xl font-bold text-sm ${
              activeId === cp.id
                ? "bg-purple-500 ring-2 ring-white"
                : cp.lat !== null
                  ? "bg-green-700"
                  : "bg-purple-900"
            }`}
          >
            {cp.emoji} {index + 1}. {cp.targetName || "?"}{" "}
            {cp.lat !== null ? "✅" : ""}
          </button>
        ))}
      </div>

      <div style={{ height: "420px", width: "100%" }}>
        <MapContainer
          center={mapCenter}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onMapClick={handleMapClick} />

          {checkpoints.map((cp, index) =>
            cp.lat !== null && cp.lng !== null ? (
              <Marker key={cp.id} position={[cp.lat, cp.lng]}>
                <Popup>
                  {index + 1}. {cp.emoji} {cp.targetName}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      <p className="text-xs opacity-70 mt-2">
        Actief punt: {checkpoints.find((cp) => cp.id === activeId)?.targetName ?? "-"}
      </p>
    </div>
  );
}
