import { NextRequest, NextResponse } from "next/server";
import { vereisModuleToegang } from "@/lib/moduleGuard";
import { haalLocatiesOp, zetLocaties } from "@/lib/zoekspel";

const MODULE_ID = "games";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const toegang = await vereisModuleToegang(MODULE_ID, "schrijven");
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const { id } = await params;
  const objecten = await haalLocatiesOp(id);

  if (!objecten) {
    return NextResponse.json({ error: "Spel niet gevonden." }, { status: 404 });
  }

  return NextResponse.json({ objecten });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const toegang = await vereisModuleToegang(MODULE_ID, "schrijven");
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const { id } = await params;

  try {
    const { objecten } = await request.json();

    if (!Array.isArray(objecten)) {
      return NextResponse.json({ error: "Ongeldige objecten-lijst." }, { status: 400 });
    }

    await zetLocaties(id, objecten);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Locaties opslaan mislukt:", error);
    return NextResponse.json({ error: "Opslaan mislukt." }, { status: 500 });
  }
}
