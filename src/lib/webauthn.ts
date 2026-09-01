import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";

import { getDb } from "@/lib/firebaseAdmin";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { Account } from "@/types/account";

function rpID(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return new URL(url).hostname;
}

function origin(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

// --- Registratie (Face ID instellen door een reeds ingelogde gebruiker) ---

export async function maakRegistratieOpties(gebruiker: Account) {
  const bestaandeCredentials = await getDb()
    .collection("promises_webauthn_credentials")
    .where("uid", "==", gebruiker.uid)
    .get();

  const opties = await generateRegistrationOptions({
    rpName: "Promises",
    rpID: rpID(),
    userID: new TextEncoder().encode(gebruiker.uid),
    userName: gebruiker.username,
    userDisplayName: gebruiker.displayName,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
      authenticatorAttachment: "platform", // Face ID / Touch ID / Windows Hello
    },
    excludeCredentials: bestaandeCredentials.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
    })),
  });

  await getDb()
    .collection("promises_webauthn_challenges")
    .doc(gebruiker.uid)
    .set({ challenge: opties.challenge, createdAt: Date.now() });

  return opties;
}

export async function verifieerRegistratie(
  gebruiker: Account,
  response: RegistrationResponseJSON,
  apparaatLabel: string
): Promise<boolean> {
  const challengeDoc = await getDb()
    .collection("promises_webauthn_challenges")
    .doc(gebruiker.uid)
    .get();

  const expectedChallenge = challengeDoc.data()?.challenge;
  if (!expectedChallenge) return false;

  const verificatie = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin(),
    expectedRPID: rpID(),
  });

  if (!verificatie.verified || !verificatie.registrationInfo) return false;

  const { credential } = verificatie.registrationInfo;

  await getDb()
    .collection("promises_webauthn_credentials")
    .doc(credential.id)
    .set({
      uid: gebruiker.uid,
      publicKey: Buffer.from(credential.publicKey).toString("base64url"),
      counter: credential.counter,
      transports: credential.transports ?? [],
      apparaatLabel,
      createdAt: Date.now(),
    });

  return true;
}

// --- Inloggen met Face ID (nog niet ingelogd, dus eerst gebruikersnaam nodig) ---

export async function maakInlogOpties(username: string) {
  const gebruikerSnapshot = await getDb()
    .collection("promises_users")
    .where("username", "==", username.trim().toLowerCase())
    .limit(1)
    .get();

  if (gebruikerSnapshot.empty) {
    throw new Error("Onbekende gebruikersnaam.");
  }

  const uid = gebruikerSnapshot.docs[0].id;

  const credentialsSnapshot = await getDb()
    .collection("promises_webauthn_credentials")
    .where("uid", "==", uid)
    .get();

  if (credentialsSnapshot.empty) {
    throw new Error("Deze gebruiker heeft nog geen Face ID ingesteld.");
  }

  const opties = await generateAuthenticationOptions({
    rpID: rpID(),
    userVerification: "required",
    allowCredentials: credentialsSnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      transports: doc.data().transports,
    })),
  });

  await getDb()
    .collection("promises_webauthn_challenges")
    .doc(uid)
    .set({ challenge: opties.challenge, createdAt: Date.now() });

  return { opties, uid };
}

export async function verifieerInlog(
  uid: string,
  response: AuthenticationResponseJSON
): Promise<boolean> {
  const challengeDoc = await getDb()
    .collection("promises_webauthn_challenges")
    .doc(uid)
    .get();

  const expectedChallenge = challengeDoc.data()?.challenge;
  if (!expectedChallenge) return false;

  const credentialDoc = await getDb()
    .collection("promises_webauthn_credentials")
    .doc(response.id)
    .get();

  if (!credentialDoc.exists || credentialDoc.data()?.uid !== uid) return false;

  const data = credentialDoc.data()!;

  const verificatie = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin(),
    expectedRPID: rpID(),
    credential: {
      id: credentialDoc.id,
      publicKey: Buffer.from(data.publicKey, "base64url"),
      counter: data.counter,
      transports: data.transports,
    },
  });

  if (!verificatie.verified) return false;

  await credentialDoc.ref.update({
    counter: verificatie.authenticationInfo.newCounter,
  });

  return true;
}
