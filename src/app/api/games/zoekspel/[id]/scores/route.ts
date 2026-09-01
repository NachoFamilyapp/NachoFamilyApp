import { NextRequest, NextResponse } from "next/server";
import { vereisModuleToegang } from "@/lib/moduleGuard";
import { haalScoresOp } from "@/lib/zoekspel";

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
  const scores = await haalScoresOp(id);

  return NextResponse.json({ scores });
}
