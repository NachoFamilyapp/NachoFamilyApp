interface MapStatusProps {
  pointCount: number;
  hasRedFlag: boolean;
  hasBlueFlag: boolean;
  hasTestPosition: boolean;
  mode: string;
}

export default function MapStatus({
  pointCount,
  hasRedFlag,
  hasBlueFlag,
  hasTestPosition,
  mode,
}: MapStatusProps) {
  return (
    <div className="mb-4 rounded-xl bg-green-700 p-4">
      <div>
        Speelgebied:{" "}
        {pointCount >= 3 ? "✅" : "❌"}
      </div>

      <div>
        Rode Vlag:{" "}
        {hasRedFlag ? "✅" : "❌"}
      </div>

      <div>
        Blauwe Vlag:{" "}
        {hasBlueFlag ? "✅" : "❌"}
      </div>

      <div>
        Testlocatie:{" "}
        {hasTestPosition ? "✅" : "❌"}
      </div>

      <div>
        Modus: {mode}
      </div>
    </div>
  );
}