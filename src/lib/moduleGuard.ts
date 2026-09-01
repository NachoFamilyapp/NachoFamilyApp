import { haalHuidigeSessie, SessiePayload } from "@/lib/session";
import { haalRechtenOp } from "@/lib/accountPermissions";
import { heeftToegang } from "@/types/account";

export async function vereisModuleToegang(
  moduleId: string,
  benodigd: "lezen" | "schrijven"
): Promise<
  { ok: true; sessie: SessiePayload } | { ok: false; status: number; error: string }
> {
  const sessie = await haalHuidigeSessie();

  if (!sessie) {
    return { ok: false, status: 401, error: "Niet ingelogd." };
  }

  const rechten = await haalRechtenOp(sessie.uid);

  if (!heeftToegang(rechten[moduleId], benodigd)) {
    return { ok: false, status: 403, error: "Geen toegang tot dit onderdeel." };
  }

  return { ok: true, sessie };
}
