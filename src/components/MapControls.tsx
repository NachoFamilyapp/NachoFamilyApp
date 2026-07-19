"use client";

interface MapControlsProps {
  mode: "area" | "redFlag" | "blueFlag" | "testPosition";

  onSelectArea: () => void;
  onSelectRedFlag: () => void;
  onSelectBlueFlag: () => void;
  onSelectTestPosition: () => void;

  onGoToCurrentLocation: () => void;
  onUndoLastPoint: () => void;
}

export default function MapControls({
  mode,
  onSelectArea,
  onSelectRedFlag,
  onSelectBlueFlag,
  onSelectTestPosition,
  onGoToCurrentLocation,
  onUndoLastPoint,
}: MapControlsProps) {
  return (
    <div className="mb-4 flex flex-col gap-2">

      <button
        type="button"
        onClick={onGoToCurrentLocation}
        className="rounded-xl bg-green-600 p-3 font-bold"
      >
        📍 Mijn locatie
      </button>

      <button
        type="button"
        onClick={onUndoLastPoint}
        className="rounded-xl bg-yellow-600 p-3 font-bold"
      >
        ↩️ Laatste punt verwijderen
      </button>

      <button
        type="button"
        onClick={onSelectArea}
        className={`rounded-xl p-3 font-bold ${
          mode === "area"
            ? "bg-blue-500"
            : "bg-blue-700"
        }`}
      >
        🗺️ Speelgebied
      </button>

      <button
        type="button"
        onClick={onSelectRedFlag}
        className={`rounded-xl p-3 font-bold ${
          mode === "redFlag"
            ? "bg-red-500"
            : "bg-red-700"
        }`}
      >
        🚩 Rode vlag
      </button>

      <button
        type="button"
        onClick={onSelectBlueFlag}
        className={`rounded-xl p-3 font-bold ${
          mode === "blueFlag"
            ? "bg-sky-500"
            : "bg-blue-900"
        }`}
      >
        🔵 Blauwe vlag
      </button>

      <button
        type="button"
        onClick={onSelectTestPosition}
        className={`rounded-xl p-3 font-bold ${
          mode === "testPosition"
            ? "bg-purple-500"
            : "bg-purple-700"
        }`}
      >
        📍 Testlocatie
      </button>

    </div>
  );
}