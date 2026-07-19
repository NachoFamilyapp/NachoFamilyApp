"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
} from "react-leaflet";

import MapClickHandler from "./MapClickHandler";

interface MapCanvasProps {
  points: [number, number][];
  redFlag: [number, number] | null;
  blueFlag: [number, number] | null;
  testPosition: [number, number] | null;

  onMapClick: (
    lat: number,
    lng: number
  ) => void;
}

export default function MapCanvas({
  points,
  redFlag,
  blueFlag,
  testPosition,
  onMapClick,
}: MapCanvasProps) {
  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={[52.045, 4.5]}
        zoom={17}
        className="h-full w-full rounded-2xl"
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onMapClick={onMapClick}
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
              🔵 Blauwe Vlag
            </Popup>
          </Marker>
        )}

        {testPosition && (
          <Marker
            position={testPosition}
          >
            <Popup>
              📍 Testlocatie
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}