import { NextRequest, NextResponse } from "next/server";
import { vereisModuleToegang } from "@/lib/moduleGuard";
import { startSpel } from "@/lib/zoekspel";
import { haalGebruikerOp } from "@/lib/accounts";

const MODULE_ID = "games";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const toegang = await vereisModuleToegang(MODULE_ID, "lezen");
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const { id } = await params;

  const gebruiker = await haalGebruikerOp(toegang.sessie.uid);
  if (!gebruiker) {
    return NextResponse.json({ error: "Gebruiker niet gevonden." }, { status: 404 });
  }

  const voortgang = await startSpel(id, gebruiker.uid, gebruiker.displayName);

  return NextResponse.json({ voortgang });
}
