import { NextRequest, NextResponse } from "next/server";
import { vereisModuleToegang } from "@/lib/moduleGuard";
import { haalSpelOp, haalVoortgangOp } from "@/lib/zoekspel";

const MODULE_ID = "games";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const toegang = await vereisModuleToegang(MODULE_ID, "lezen");
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const { id } = await params;

  const spel = await haalSpelOp(id);
  if (!spel) {
    return NextResponse.json({ error: "Spel niet gevonden." }, { status: 404 });
  }

  const voortgang = await haalVoortgangOp(id, toegang.sessie.uid);

  return NextResponse.json({ spel, voortgang });
}
