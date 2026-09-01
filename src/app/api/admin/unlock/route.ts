import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { haalHuidigeSessie, zetBeheerOntgrendeld } from "@/lib/session";
import { haalBeheerWachtwoordHashOp, zetBeheerWachtwoordHash } from "@/lib/accountPermissions";

export async function POST(request: NextRequest) {
  const sessie = await haalHuidigeSessie();

  if (!sessie || !sessie.isAdmin) {
    return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
  }

  const { wachtwoord } = await request.json();

  if (!wachtwoord) {
    return NextResponse.json({ error: "Wachtwoord is verplicht." }, { status: 400 });
  }

  const bestaandeHash = await haalBeheerWachtwoordHashOp();

  // Eerste keer: er is nog geen Beheer-wachtwoord ingesteld. Dan stelt
  // de eerste beheerder het meteen in met wat hij nu invoert.
  if (!bestaandeHash) {
    const nieuweHash = await bcrypt.hash(wachtwoord, 12);
    await zetBeheerWachtwoordHash(nieuweHash);
    await zetBeheerOntgrendeld();
    return NextResponse.json({ success: true, nieuwIngesteld: true });
  }

  const klopt = await bcrypt.compare(wachtwoord, bestaandeHash);

  if (!klopt) {
    return NextResponse.json({ error: "Onjuist Beheer-wachtwoord." }, { status: 401 });
  }

  await zetBeheerOntgrendeld();
  return NextResponse.json({ success: true, nieuwIngesteld: false });
}
