import { NextRequest, NextResponse } from "next/server";
import { vereisModuleToegang } from "@/lib/moduleGuard";
import { verwijderSpel } from "@/lib/zoekspel";

const MODULE_ID = "games";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const toegang = await vereisModuleToegang(MODULE_ID, "schrijven");
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const { id } = await params;
  await verwijderSpel(id);

  return NextResponse.json({ success: true });
}
