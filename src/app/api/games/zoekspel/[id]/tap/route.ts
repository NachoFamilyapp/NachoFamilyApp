import { NextRequest, NextResponse } from "next/server";
import { vereisModuleToegang } from "@/lib/moduleGuard";
import { verwerkTik } from "@/lib/zoekspel";

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

  try {
    const { x, y } = await request.json();

    if (typeof x !== "number" || typeof y !== "number") {
      return NextResponse.json({ error: "Ongeldige coördinaten." }, { status: 400 });
    }

    const resultaat = await verwerkTik(id, toegang.sessie.uid, x, y);

    if (!resultaat) {
      return NextResponse.json(
        { error: "Spel niet gevonden of nog niet gestart." },
        { status: 404 }
      );
    }

    return NextResponse.json(resultaat);
  } catch (error) {
    console.error("Tik verwerken mislukt:", error);
    return NextResponse.json({ error: "Er ging iets mis." }, { status: 500 });
  }
}
