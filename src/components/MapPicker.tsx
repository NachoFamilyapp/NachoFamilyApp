"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";

function MapClickHandler({
  onAddPoint,
}: {
  onAddPoint: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onAddPoint(
        e.latlng.lat,
        e.latlng.lng
      );
    },
  });

  return null;
}

export default function MapPicker() {
  const [points, setPoints] = useState<
    [number, number][]
  >([]);

  const addPoint = (
    lat: number,
    lng: number
  ) => {
    setPoints([
      ...points,
      [lat, lng],
    ]);
  };

  const saveArea = () => {
    localStorage.setItem(
      "playArea",
      JSON.stringify(points)
    );

    alert(
      `${points.length} punten opgeslagen`
    );
  };

  return (
    <div>
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
            onAddPoint={addPoint}
          />

          {points.map(
            (point, index) => (
              <Marker
                key={index}
                position={point}
              />
            )
          )}

          {points.length >= 3 && (
            <Polygon
              positions={points}
            />
          )}
        </MapContainer>
      </div>

      <button
        onClick={saveArea}
        className="bg-green-600 px-6 py-3 rounded-xl mt-4"
      >
        Speelgebied Opslaan
      </button>
    </div>
  );
}