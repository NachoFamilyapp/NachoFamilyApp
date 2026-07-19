import { LatLng } from "@/types/game";

/**
 * Bereken afstand tussen 2 GPS punten (meters)
 * Haversine formule
 */
export function distanceBetween(
  point1: LatLng,
  point2: LatLng
): number {
  const R = 6371000;

  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

/**
 * Richting (bearing)
 * 0 = Noord
 * 90 = Oost
 */
export function bearingBetween(
  start: LatLng,
  end: LatLng
): number {
  const lat1 = toRad(start.lat);
  const lat2 = toRad(end.lat);

  const dLng = toRad(
    end.lng - start.lng
  );

  const y =
    Math.sin(dLng) *
    Math.cos(lat2);

  const x =
    Math.cos(lat1) *
      Math.sin(lat2) -
    Math.sin(lat1) *
      Math.cos(lat2) *
      Math.cos(dLng);

  const bearing =
    Math.atan2(y, x);

  return (
    (bearing * 180) / Math.PI + 360
  ) % 360;
}

/**
 * GPS punt binnen polygon?
 */
export function pointInPolygon(
  point: LatLng,
  polygon: LatLng[]
): boolean {

  let inside = false;

  for (
    let i = 0,
      j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;

    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect =
      yi > point.lat !==
        yj > point.lat &&
      point.lng <
        ((xj - xi) *
          (point.lat - yi)) /
          (yj - yi) +
          xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Dichtstbijzijnde locatie
 */
export function nearestPoint(
  current: LatLng,
  points: LatLng[]
): LatLng | null {

  if (!points.length)
    return null;

  let nearest = points[0];

  let distance =
    distanceBetween(
      current,
      nearest
    );

  for (const point of points) {

    const d =
      distanceBetween(
        current,
        point
      );

    if (d < distance) {

      distance = d;

      nearest = point;

    }
  }

  return nearest;
}

/**
 * GPS nauwkeurigheid
 */
export function accuracyText(
  accuracy: number
): string {

  if (accuracy <= 5)
    return "Perfect";

  if (accuracy <= 10)
    return "Goed";

  if (accuracy <= 20)
    return "Redelijk";

  if (accuracy <= 40)
    return "Matig";

  return "Slecht";

}

function toRad(
  value: number
) {
  return (
    value *
    Math.PI /
    180
  );
}