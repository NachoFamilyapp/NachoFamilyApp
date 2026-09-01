import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// We gebruiken bewust ALLEEN de Admin SDK, server-side, voor Promises.
// Dat betekent: de client praat nooit rechtstreeks met Firestore, alles
// loopt via onze eigen API-routes. Zo ligt alle toegangscontrole (wie
// mag wat lezen/schrijven) in onze eigen, overzichtelijke code, en niet
// in losse Firestore-beveiligingsregels die eerder voor stille fouten
// zorgden bij Vakantie App.

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin omgevingsvariabelen ontbreken. Zet FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL en FIREBASE_ADMIN_PRIVATE_KEY in .env.local / Vercel."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let firestoreInstance: Firestore | null = null;

export function getDb(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getAdminApp());
  }
  return firestoreInstance;
}
