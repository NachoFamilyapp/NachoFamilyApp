import { NextRequest, NextResponse } from "next/server";
import { vereisBeheerToegang } from "@/lib/adminGuard";
import { haalAlleGebruikersOp, maakGebruikerAan } from "@/lib/accounts";

export async function GET() {
  const toegang = await vereisBeheerToegang();
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const gebruikers = await haalAlleGebruikersOp();
  return NextResponse.json({ gebruikers });
}

export async function POST(request: NextRequest) {
  const toegang = await vereisBeheerToegang();
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  try {
    const { username, displayName, wachtwoord, isAdmin } = await request.json();

    if (!username || !displayName || !wachtwoord) {
      return NextResponse.json(
        { error: "Gebruikersnaam, naam en wachtwoord zijn verplicht." },
        { status: 400 }
      );
    }

    if (wachtwoord.length < 4) {
      return NextResponse.json(
        { error: "Wachtwoord moet minimaal 4 tekens zijn." },
        { status: 400 }
      );
    }

    const gebruiker = await maakGebruikerAan(
      username,
      displayName,
      wachtwoord,
      Boolean(isAdmin)
    );

    return NextResponse.json({ gebruiker });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Aanmaken mislukt.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
