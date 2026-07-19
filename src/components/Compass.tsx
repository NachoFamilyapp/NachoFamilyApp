"use client";

import { useEffect, useMemo, useState } from "react";

import { LatLng } from "@/types/game";
import { bearingBetween } from "@/lib/gps";

type CompassProps = {
  currentPosition: LatLng | null;
  targetPosition: LatLng | null;
};

export default function Compass({
  currentPosition,
  targetPosition,
}: CompassProps) {

  const [heading, setHeading] =
    useState(0);

  useEffect(() => {

    function handleOrientation(
      event: DeviceOrientationEvent
    ) {

      if (
        event.alpha === null
      )
        return;

      setHeading(event.alpha);

    }

    window.addEventListener(
      "deviceorientation",
      handleOrientation
    );

    return () =>
      window.removeEventListener(
        "deviceorientation",
        handleOrientation
      );

  }, []);

  const targetBearing =
    useMemo(() => {

      if (
        !currentPosition ||
        !targetPosition
      )
        return 0;

      return bearingBetween(
        currentPosition,
        targetPosition
      );

    }, [
      currentPosition,
      targetPosition,
    ]);

  const rotation =
    targetBearing - heading;

  return (

    <div className="w-full flex flex-col items-center">

      <div className="text-3xl font-bold mb-6">

        🧭 Kompas

      </div>

      <div className="relative w-72 h-72 rounded-full border-8 border-gray-700 bg-white">

        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-red-600 font-bold">
          N
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          Z
        </div>

        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          W
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          O
        </div>

        <div
          className="absolute left-1/2 top-1/2 origin-bottom transition-transform duration-300"
          style={{
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
          }}
        >

          <div className="text-7xl">
            ▲
          </div>

        </div>

      </div>

      <div className="mt-6 text-xl font-bold">

        🚩 Doel gevonden

      </div>

    </div>

  );

}