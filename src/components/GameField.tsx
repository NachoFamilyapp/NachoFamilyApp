"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";

function FlagPlacement({
  setFlag,
}: {
  setFlag: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      setFlag(
        e.latlng.lat,
        e.latlng.lng
      );
    },
  });

  return null;
}

export default function GameField() {
  const area = JSON.parse(
    localStorage.getItem("playArea") || "[]"
  );

  const [redFlag, setRedFlag] =
    useState<[number, number] | null>(null);

  const [blueFlag, setBlueFlag] =
    useState<[number, number] | null>(null);

  const saveFlags = () => {
    localStorage.setItem(
      "redFlag",
      JSON.stringify(redFlag)
    );

    localStorage.setItem(
      "blueFlag",
      JSON.stringify(blueFlag)
    );

    alert("Vlaggen opgeslagen");
  };

  return (
    <>
      <div
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <MapContainer
          center={[52.045, 4.5]}
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

          <FlagPlacement
            setFlag={(lat, lng) => {
              if (!redFlag) {
                setRedFlag([lat, lng]);
              } else {
                setBlueFlag([lat, lng]);
              }
            }}
          />

          {area.length >= 3 && (
            <Polygon positions={area} />
          )}

          {redFlag && (
            <Marker position={redFlag} />
          )}

          {blueFlag && (
            <Marker position={blueFlag} />
          )}
        </MapContainer>
      </div>

      <button
        onClick={saveFlags}
        className="bg-green-600 px-6 py-3 rounded-xl mt-4"
      >
        Vlaggen Opslaan
      </button>
    </>
  );
}