import { NextRequest, NextResponse } from "next/server";
import { vereisBeheerToegang } from "@/lib/adminGuard";
import { werkGebruikerBij, zetNieuwWachtwoord } from "@/lib/accounts";

export async function POST(request: NextRequest) {
  const toegang = await vereisBeheerToegang();
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  try {
    const { uid, displayName, isAdmin, nieuwWachtwoord } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "uid is verplicht." }, { status: 400 });
    }

    if (displayName !== undefined || isAdmin !== undefined) {
      await werkGebruikerBij(uid, {
        ...(displayName !== undefined ? { displayName } : {}),
        ...(isAdmin !== undefined ? { isAdmin: Boolean(isAdmin) } : {}),
      });
    }

    if (nieuwWachtwoord) {
      if (nieuwWachtwoord.length < 4) {
        return NextResponse.json(
          { error: "Wachtwoord moet minimaal 4 tekens zijn." },
          { status: 400 }
        );
      }
      await zetNieuwWachtwoord(uid, nieuwWachtwoord);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bijwerken mislukt:", error);
    return NextResponse.json({ error: "Bijwerken mislukt." }, { status: 500 });
  }
}
