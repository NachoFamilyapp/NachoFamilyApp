import { NextRequest, NextResponse } from "next/server";
import { verifieerInlog } from "@/lib/webauthn";
import { haalGebruikerOp } from "@/lib/accounts";
import { maakSessieToken, zetSessieCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { uid, response } = await request.json();

    if (!uid || !response) {
      return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
    }

    const gelukt = await verifieerInlog(uid, response);

    if (!gelukt) {
      return NextResponse.json({ error: "Face ID-verificatie mislukt." }, { status: 401 });
    }

    const gebruiker = await haalGebruikerOp(uid);
    if (!gebruiker) {
      return NextResponse.json({ error: "Gebruiker niet gevonden." }, { status: 404 });
    }

    const token = await maakSessieToken({
      uid: gebruiker.uid,
      username: gebruiker.username,
      isAdmin: gebruiker.isAdmin,
    });

    await zetSessieCookie(token);

    return NextResponse.json({ gebruiker });
  } catch (error) {
    console.error("Face ID inloggen mislukt:", error);
    return NextResponse.json({ error: "Er ging iets mis." }, { status: 500 });
  }
}
