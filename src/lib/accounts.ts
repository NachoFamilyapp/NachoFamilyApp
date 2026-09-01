import bcrypt from "bcryptjs";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { Account } from "@/types/account";

interface GebruikerMetHash extends Account {
  passwordHash: string;
}

function normaliseerGebruikersnaam(username: string): string {
  return username.trim().toLowerCase();
}

export async function haalGebruikerOpViaNaam(
  username: string
): Promise<GebruikerMetHash | null> {
  const naam = normaliseerGebruikersnaam(username);

  const snapshot = await getDb()
    .collection("promises_users")
    .where("username", "==", naam)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    uid: doc.id,
    username: data.username,
    displayName: data.displayName,
    isAdmin: Boolean(data.isAdmin),
    createdAt: data.createdAt,
    heeftFaceId: Boolean(data.heeftFaceId),
    passwordHash: data.passwordHash,
  };
}

export async function haalGebruikerOp(uid: string): Promise<Account | null> {
  const snapshot = await getDb().collection("promises_users").doc(uid).get();
  if (!snapshot.exists) return null;

  const data = snapshot.data()!;
  return {
    uid: snapshot.id,
    username: data.username,
    displayName: data.displayName,
    isAdmin: Boolean(data.isAdmin),
    createdAt: data.createdAt,
    heeftFaceId: Boolean(data.heeftFaceId),
  };
}

export async function haalAlleGebruikersOp(): Promise<Account[]> {
  const snapshot = await getDb().collection("promises_users").orderBy("createdAt", "asc").get();

  return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    return {
      uid: doc.id,
      username: data.username,
      displayName: data.displayName,
      isAdmin: Boolean(data.isAdmin),
      createdAt: data.createdAt,
      heeftFaceId: Boolean(data.heeftFaceId),
    };
  });
}

export async function maakGebruikerAan(
  username: string,
  displayName: string,
  wachtwoord: string,
  isAdmin: boolean
): Promise<Account> {
  const naam = normaliseerGebruikersnaam(username);

  const bestaat = await haalGebruikerOpViaNaam(naam);
  if (bestaat) {
    throw new Error("Deze gebruikersnaam bestaat al.");
  }

  const passwordHash = await bcrypt.hash(wachtwoord, 12);
  const ref = getDb().collection("promises_users").doc();

  const nieuwGebruiker = {
    username: naam,
    displayName: displayName.trim(),
    passwordHash,
    isAdmin,
    createdAt: Date.now(),
    heeftFaceId: false,
  };

  await ref.set(nieuwGebruiker);

  return {
    uid: ref.id,
    username: nieuwGebruiker.username,
    displayName: nieuwGebruiker.displayName,
    isAdmin: nieuwGebruiker.isAdmin,
    createdAt: nieuwGebruiker.createdAt,
    heeftFaceId: false,
  };
}

export async function verifieerWachtwoord(
  username: string,
  wachtwoord: string
): Promise<Account | null> {
  const gebruiker = await haalGebruikerOpViaNaam(username);
  if (!gebruiker) return null;

  const klopt = await bcrypt.compare(wachtwoord, gebruiker.passwordHash);
  if (!klopt) return null;

  const { passwordHash: _passwordHash, ...zonderHash } = gebruiker;
  return zonderHash;
}

export async function zetNieuwWachtwoord(uid: string, wachtwoord: string) {
  const passwordHash = await bcrypt.hash(wachtwoord, 12);
  await getDb().collection("promises_users").doc(uid).update({ passwordHash });
}

export async function werkGebruikerBij(
  uid: string,
  wijzigingen: Partial<Pick<Account, "displayName" | "isAdmin">>
) {
  await getDb().collection("promises_users").doc(uid).update(wijzigingen);
}

export async function verwijderGebruiker(uid: string) {
  const db = getDb();
  await db.collection("promises_users").doc(uid).delete();
  await db.collection("promises_permissions").doc(uid).delete();

  const credentials = await db
    .collection("promises_webauthn_credentials")
    .where("uid", "==", uid)
    .get();

  await Promise.all(credentials.docs.map((doc: QueryDocumentSnapshot) => doc.ref.delete()));
}

export async function zetHeeftFaceId(uid: string, waarde: boolean) {
  await getDb().collection("promises_users").doc(uid).update({ heeftFaceId: waarde });
}
