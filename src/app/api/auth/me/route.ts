import { NextResponse } from "next/server";
import { haalHuidigeSessie } from "@/lib/session";
import { haalGebruikerOp } from "@/lib/accounts";
import { haalRechtenOp } from "@/lib/accountPermissions";

export async function GET() {
  const sessie = await haalHuidigeSessie();

  if (!sessie) {
    return NextResponse.json({ gebruiker: null });
  }

  const gebruiker = await haalGebruikerOp(sessie.uid);

  if (!gebruiker) {
    return NextResponse.json({ gebruiker: null });
  }

  const rechten = await haalRechtenOp(sessie.uid);

  return NextResponse.json({ gebruiker, rechten });
}
