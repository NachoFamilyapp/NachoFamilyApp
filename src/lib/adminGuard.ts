import { haalHuidigeSessie, isBeheerOntgrendeld } from "@/lib/session";
import { SessiePayload } from "@/lib/session";

export async function vereisBeheerToegang(): Promise<
  { ok: true; sessie: SessiePayload } | { ok: false; status: number; error: string }
> {
  const sessie = await haalHuidigeSessie();

  if (!sessie) {
    return { ok: false, status: 401, error: "Niet ingelogd." };
  }

  if (!sessie.isAdmin) {
    return { ok: false, status: 403, error: "Geen beheerder." };
  }

  const ontgrendeld = await isBeheerOntgrendeld();

  if (!ontgrendeld) {
    return { ok: false, status: 403, error: "Beheer-gedeelte is nog vergrendeld." };
  }

  return { ok: true, sessie };
}
