import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "promises_session";
const BEHEER_COOKIE = "promises_beheer_ontgrendeld";
const DERTIG_DAGEN = 60 * 60 * 24 * 30;

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET ontbreekt in de omgevingsvariabelen.");
  }
  return new TextEncoder().encode(secret);
}

export interface SessiePayload {
  uid: string;
  username: string;
  isAdmin: boolean;
}

export async function maakSessieToken(payload: SessiePayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DERTIG_DAGEN}s`)
    .sign(getSecret());
}

export async function leesSessieToken(token: string): Promise<SessiePayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessiePayload;
  } catch {
    return null;
  }
}

export async function haalHuidigeSessie(): Promise<SessiePayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return leesSessieToken(token);
}

export async function zetSessieCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: DERTIG_DAGEN,
  });
}

export async function wisSessieCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(BEHEER_COOKIE);
}

// Los, kortlevend "ontgrendeld"-vlaggetje specifiek voor het Beheer-
// gedeelte, zoals gevraagd: een eigen wachtwoord om Beheer te blokkeren,
// los van het normale inlogwachtwoord van de gebruiker.
export async function zetBeheerOntgrendeld() {
  const cookieStore = await cookies();
  cookieStore.set(BEHEER_COOKIE, "ja", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 uur, daarna opnieuw het Beheer-wachtwoord vragen
  });
}

export async function isBeheerOntgrendeld(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(BEHEER_COOKIE)?.value === "ja";
}
