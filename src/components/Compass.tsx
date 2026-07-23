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

const CENTER = 150;
const OUTER_RADIUS = 140;
const TICK_OUTER = 128;
const MINOR_TICK_INNER = 120;
const MAJOR_TICK_INNER = 112;
const CARDINAL_TICK_INNER = 104;
const LABEL_RADIUS = 95;

function poolCoord(deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
}

function majorLabel(deg: number): string {
  if (deg === 0) return "N";
  if (deg === 90) return "O";
  if (deg === 180) return "Z";
  if (deg === 270) return "W";
  return String(deg);
}

function cardinal8(deg: number): string {
  const dirs = ["N", "NO", "O", "ZO", "Z", "ZW", "W", "NW"];
  const index = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return dirs[index];
}

const MINOR_DEGREES = Array.from({ length: 36 }, (_, i) => i * 10).filter(
  (d) => d % 30 !== 0
);

const MAJOR_DEGREES = Array.from({ length: 12 }, (_, i) => i * 30);

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

  const naaldRotatie = targetBearing - heading;

  const minorTicks = useMemo(
    () =>
      MINOR_DEGREES.map((deg) => {
        const outer = poolCoord(deg, TICK_OUTER);
        const inner = poolCoord(deg, MINOR_TICK_INNER);
        return { deg, outer, inner };
      }),
    []
  );

  const majorTicks = useMemo(
    () =>
      MAJOR_DEGREES.map((deg) => {
        const isCardinal = deg % 90 === 0;
        const outer = poolCoord(deg, TICK_OUTER);
        const inner = poolCoord(
          deg,
          isCardinal ? CARDINAL_TICK_INNER : MAJOR_TICK_INNER
        );
        const labelPos = poolCoord(deg, LABEL_RADIUS);
        return { deg, isCardinal, outer, inner, labelPos };
      }),
    []
  );

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

      <div className="relative w-72 h-72">

        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">

          <defs>
            <radialGradient id="dialGradient" cx="50%" cy="45%" r="70%">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#0b0f19" />
            </radialGradient>
          </defs>

          {/* Buitenring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_RADIUS}
            fill="url(#dialGradient)"
            stroke="#4b5563"
            strokeWidth={3}
          />

          {/* Draaiende wijzerplaat met streepjes en graden */}
          <g
            style={{
              transform: `rotate(${-heading}deg)`,
              transformOrigin: `${CENTER}px ${CENTER}px`,
              transition: "transform 150ms linear",
            }}
          >

            {minorTicks.map(({ deg, outer, inner }) => (
              <line
                key={deg}
                x1={outer.x}
                y1={outer.y}
                x2={inner.x}
                y2={inner.y}
                stroke="#6b7280"
                strokeWidth={1.5}
              />
            ))}

            {majorTicks.map(({ deg, isCardinal, outer, inner, labelPos }) => (
              <g key={deg}>
                <line
                  x1={outer.x}
                  y1={outer.y}
                  x2={inner.x}
                  y2={inner.y}
                  stroke={isCardinal && deg === 0 ? "#ef4444" : "#e5e7eb"}
                  strokeWidth={isCardinal ? 3.5 : 2.5}
                />

                <g
                  transform={`translate(${labelPos.x} ${labelPos.y}) rotate(${heading - deg})`}
                >
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isCardinal ? 22 : 13}
                    fontWeight="bold"
                    fill={isCardinal && deg === 0 ? "#ef4444" : "#e5e7eb"}
                  >
                    {majorLabel(deg)}
                  </text>
                </g>
              </g>
            ))}

          </g>

          {/* Vaste inkeping bovenaan: dit is waar je nu naartoe kijkt */}
          <polygon points="150,10 141,32 159,32" fill="#f3f4f6" />

          {/* Naald die naar het doel wijst */}
          {targetPosition && (
            <g
              style={{
                transform: `rotate(${naaldRotatie}deg)`,
                transformOrigin: `${CENTER}px ${CENTER}px`,
                transition: "transform 150ms linear",
              }}
            >
              <polygon
                points={`${CENTER},40 ${CENTER - 9},${CENTER} ${CENTER + 9},${CENTER}`}
                fill="#f59e0b"
              />
              <polygon
                points={`${CENTER - 9},${CENTER} ${CENTER + 9},${CENTER} ${CENTER},${CENTER + 34}`}
                fill="#d1d5db"
              />
              <circle cx={CENTER} cy={CENTER} r={10} fill="#111827" stroke="#f59e0b" strokeWidth={3} />
            </g>
          )}

          {!targetPosition && (
            <circle cx={CENTER} cy={CENTER} r={10} fill="#111827" stroke="#9ca3af" strokeWidth={3} />
          )}

          {/* Middenweergave: huidige richting in graden */}
          <text
            x={CENTER}
            y={CENTER + 62}
            textAnchor="middle"
            fontSize={22}
            fontWeight="bold"
            fill="#f9fafb"
          >
            {hasHeading ? `${Math.round(heading)}°` : "--°"}
          </text>

          <text
            x={CENTER}
            y={CENTER + 82}
            textAnchor="middle"
            fontSize={14}
            fill="#9ca3af"
          >
            {hasHeading ? cardinal8(heading) : "..."}
          </text>

        </svg>

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
