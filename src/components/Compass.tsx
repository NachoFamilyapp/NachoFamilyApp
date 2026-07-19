"use client";

import { useEffect, useMemo, useState } from "react";

import { LatLng } from "@/types/game";
import { bearingBetween, distanceBetween } from "@/lib/gps";
import {
  needsCompassPermission,
  requestCompassPermission,
  headingFromEvent,
} from "@/lib/compass";

type CompassProps = {
  currentPosition: LatLng | null;
  targetPosition: LatLng | null;
  label?: string;
};

export default function Compass({
  currentPosition,
  targetPosition,
  label,
}: CompassProps) {

  const [heading, setHeading] = useState(0);
  const [hasHeading, setHasHeading] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(needsCompassPermission);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {

    function handleOrientation(event: DeviceOrientationEvent) {
      const value = headingFromEvent(event);

      if (value !== null) {
        setHeading(value);
        setHasHeading(true);
      }
    }

    window.addEventListener("deviceorientationabsolute", handleOrientation as EventListener);
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation as EventListener);
      window.removeEventListener("deviceorientation", handleOrientation);
    };

  }, []);

  async function activateCompass() {
    const granted = await requestCompassPermission();

    if (!granted) {
      setPermissionDenied(true);
      return;
    }

    setNeedsPermission(false);
  }

  const targetBearing = useMemo(() => {
    if (!currentPosition || !targetPosition) return 0;
    return bearingBetween(currentPosition, targetPosition);
  }, [currentPosition, targetPosition]);

  const distance = useMemo(() => {
    if (!currentPosition || !targetPosition) return null;
    return distanceBetween(currentPosition, targetPosition);
  }, [currentPosition, targetPosition]);

  const rotation = targetBearing - heading;

  if (needsPermission) {
    return (
      <div className="w-full flex flex-col items-center gap-4 text-center">
        <div className="text-3xl font-bold">🧭 Kompas</div>

        <p className="opacity-90 max-w-xs">
          Deze telefoon vraagt eerst toestemming om het kompas te
          gebruiken.
        </p>

        <button
          onClick={activateCompass}
          className="bg-blue-600 px-6 py-4 rounded-2xl text-xl font-bold"
        >
          🧭 Kompas activeren
        </button>

        {permissionDenied && (
          <p className="text-red-300 text-sm max-w-xs">
            Geen toestemming gekregen. Ga naar de instellingen van je
            telefoon en sta bewegingssensoren toe voor deze website.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">

      {label && (
        <div className="text-xl font-bold mb-2 text-center">{label}</div>
      )}

      <div className="relative w-64 h-64 rounded-full border-8 border-gray-700 bg-white">

        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-red-600 font-bold">
          N
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-black">
          Z
        </div>

        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
          W
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
          O
        </div>

        <div
          className="absolute left-1/2 top-1/2 origin-bottom transition-transform duration-300"
          style={{
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
          }}
        >
          <div className="text-6xl">▲</div>
        </div>

      </div>

      {!hasHeading && (
        <div className="mt-3 text-sm opacity-80 text-center max-w-xs">
          Kompas wordt gezocht... beweeg je telefoon in een 8-vorm als dit
          lang duurt.
        </div>
      )}

      <div className="mt-4 text-xl font-bold">
        {distance === null
          ? "📍 Locatie zoeken..."
          : distance < 15
            ? "🎉 Je bent er bijna!"
            : `${Math.round(distance)} meter te gaan`}
      </div>

    </div>
  );
}
