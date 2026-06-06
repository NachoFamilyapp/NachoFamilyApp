"use client";

import dynamic from "next/dynamic";

const MapPicker = dynamic(
  () =>
    import(
      "@/components/MapPicker"
    ),
  {
    ssr: false,
  }
);

export default function AdminAreaPage() {
  return (
    <main className="min-h-screen bg-green-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">
        Speelgebied Tekenen
      </h1>

      <p className="mb-6">
        Klik op de kaart om
        hoekpunten toe te voegen.
      </p>

      <MapPicker />
    </main>
  );
}