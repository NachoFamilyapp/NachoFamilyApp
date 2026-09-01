import { NextRequest, NextResponse } from "next/server";
import { verifieerWachtwoord } from "@/lib/accounts";
import { maakSessieToken, zetSessieCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { username, wachtwoord } = await request.json();

    if (!username || !wachtwoord) {
      return NextResponse.json(
        { error: "Gebruikersnaam en wachtwoord zijn verplicht." },
        { status: 400 }
      );
    }

    const gebruiker = await verifieerWachtwoord(username, wachtwoord);

    if (!gebruiker) {
      return NextResponse.json(
        { error: "Onjuiste gebruikersnaam of wachtwoord." },
        { status: 401 }
      );
    }

    const token = await maakSessieToken({
      uid: gebruiker.uid,
      username: gebruiker.username,
      isAdmin: gebruiker.isAdmin,
    });

    await zetSessieCookie(token);

    return NextResponse.json({ gebruiker });
  } catch (error) {
    console.error("Login mislukt:", error);
    return NextResponse.json({ error: "Er ging iets mis bij het inloggen." }, { status: 500 });
  }
}
