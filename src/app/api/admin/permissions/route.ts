import { NextRequest, NextResponse } from "next/server";
import { vereisBeheerToegang } from "@/lib/adminGuard";
import { zetRecht } from "@/lib/accountPermissions";
import { PermissieNiveau } from "@/types/account";

const GELDIGE_NIVEAUS: PermissieNiveau[] = ["geen", "lezen", "schrijven"];

export async function POST(request: NextRequest) {
  const toegang = await vereisBeheerToegang();
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const { uid, moduleId, niveau } = await request.json();

  if (!uid || !moduleId || !GELDIGE_NIVEAUS.includes(niveau)) {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }

  await zetRecht(uid, moduleId, niveau);

  return NextResponse.json({ success: true });
}
