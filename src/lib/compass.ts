// Hulpfuncties voor het gebruik van het kompas van de telefoon.
//
// Belangrijk iOS-detail: Safari op iPhone (iOS 13+) geeft alleen
// oriëntatie-data vrij nadat de gebruiker expliciet toestemming heeft
// gegeven via DeviceOrientationEvent.requestPermission(), en dat mag
// alleen aangeroepen worden vanuit een echte tik/klik van de gebruiker.
// Android heeft deze permissie-stap niet nodig.

type DeviceOrientationEventIOS = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type DeviceOrientationEventWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

/**
 * Moet er eerst om toestemming gevraagd worden voor het kompas?
 * (Alleen relevant op iOS 13+ / Safari)
 */
export function needsCompassPermission(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof DeviceOrientationEvent === "undefined") return false;

  const ios = DeviceOrientationEvent as DeviceOrientationEventIOS;

  return typeof ios.requestPermission === "function";
}

/**
 * Vraag toestemming voor het kompas. Moet aangeroepen worden
 * vanuit een click/tap-handler (user gesture), anders weigert iOS.
 */
export async function requestCompassPermission(): Promise<boolean> {
  try {
    const ios = DeviceOrientationEvent as DeviceOrientationEventIOS;

    if (typeof ios.requestPermission === "function") {
      const result = await ios.requestPermission();
      return result === "granted";
    }

    return true;
  } catch (error) {
    console.error("Kompas-permissie mislukt:", error);
    return false;
  }
}

/**
 * Haal een bruikbare kompas-richting (0-360, 0 = Noord) uit een
 * deviceorientation-event, ongeacht platform.
 */
export function headingFromEvent(
  event: DeviceOrientationEvent
): number | null {
  const iosEvent = event as DeviceOrientationEventWithCompass;

  // iOS Safari: geeft al een echte kompasrichting (noord-gerefereerd)
  if (typeof iosEvent.webkitCompassHeading === "number") {
    return iosEvent.webkitCompassHeading;
  }

  // Android (en de meeste andere browsers): alpha draait de andere kant op
  if (event.alpha !== null) {
    return (360 - event.alpha) % 360;
  }

  return null;
}
