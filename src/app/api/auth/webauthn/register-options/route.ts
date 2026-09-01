import { NextResponse } from "next/server";
import { haalHuidigeSessie } from "@/lib/session";
import { haalGebruikerOp } from "@/lib/accounts";
import { maakRegistratieOpties } from "@/lib/webauthn";

export async function POST() {
  const sessie = await haalHuidigeSessie();
  if (!sessie) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const gebruiker = await haalGebruikerOp(sessie.uid);
  if (!gebruiker) {
    return NextResponse.json({ error: "Gebruiker niet gevonden." }, { status: 404 });
  }

  const opties = await maakRegistratieOpties(gebruiker);
  return NextResponse.json(opties);
}
