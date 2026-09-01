import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { vereisBeheerToegang } from "@/lib/adminGuard";
import { zetBeheerWachtwoordHash } from "@/lib/accountPermissions";

export async function POST(request: NextRequest) {
  const toegang = await vereisBeheerToegang();
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const { nieuwWachtwoord } = await request.json();

  if (!nieuwWachtwoord || nieuwWachtwoord.length < 4) {
    return NextResponse.json(
      { error: "Nieuw wachtwoord moet minimaal 4 tekens zijn." },
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(nieuwWachtwoord, 12);
  await zetBeheerWachtwoordHash(hash);

  return NextResponse.json({ success: true });
}
