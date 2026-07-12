"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

interface MapToolsMapProps {
  location: [number, number];
}

export default function MapToolsMap({
  location,
}: MapToolsMapProps) {
  return (
    <div
      style={{
        height: "600px",
        width: "100%",
      }}
    >
      <MapContainer
        center={location}
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

        <Marker position={location}>
          <Popup>
            📍 Mijn Locatie
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}