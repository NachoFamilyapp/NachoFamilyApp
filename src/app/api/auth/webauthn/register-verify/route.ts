import { NextRequest, NextResponse } from "next/server";
import { haalHuidigeSessie } from "@/lib/session";
import { haalGebruikerOp, zetHeeftFaceId } from "@/lib/accounts";
import { verifieerRegistratie } from "@/lib/webauthn";

export async function POST(request: NextRequest) {
  const sessie = await haalHuidigeSessie();
  if (!sessie) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const gebruiker = await haalGebruikerOp(sessie.uid);
  if (!gebruiker) {
    return NextResponse.json({ error: "Gebruiker niet gevonden." }, { status: 404 });
  }

  try {
    const { response, apparaatLabel } = await request.json();

    const gelukt = await verifieerRegistratie(
      gebruiker,
      response,
      apparaatLabel || "Onbekend apparaat"
    );

    if (!gelukt) {
      return NextResponse.json({ error: "Face ID registratie mislukt." }, { status: 400 });
    }

    await zetHeeftFaceId(gebruiker.uid, true);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Face ID registratie mislukt:", error);
    return NextResponse.json({ error: "Er ging iets mis." }, { status: 500 });
  }
}
