import { NextRequest, NextResponse } from "next/server";
import { vereisModuleToegang } from "@/lib/moduleGuard";
import { haalAlleSpellenOp, maakSpelAan } from "@/lib/zoekspel";

const MODULE_ID = "games";

export async function GET() {
  const toegang = await vereisModuleToegang(MODULE_ID, "lezen");
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const spellen = await haalAlleSpellenOp();
  return NextResponse.json({ spellen });
}

export async function POST(request: NextRequest) {
  const toegang = await vereisModuleToegang(MODULE_ID, "schrijven");
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  try {
    const { titel, afbeelding, objecten } = await request.json();

    if (!titel || !afbeelding || !Array.isArray(objecten) || objecten.length === 0) {
      return NextResponse.json({ error: "Titel, afbeelding en objecten zijn verplicht." }, { status: 400 });
    }

    const spel = await maakSpelAan(titel, afbeelding, objecten);
    return NextResponse.json({ spel });
  } catch (error) {
    console.error("Zoekspel aanmaken mislukt:", error);
    return NextResponse.json({ error: "Aanmaken mislukt." }, { status: 500 });
  }
}
