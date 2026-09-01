import { NextRequest, NextResponse } from "next/server";
import { maakInlogOpties } from "@/lib/webauthn";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Gebruikersnaam is verplicht." }, { status: 400 });
    }

    const { opties, uid } = await maakInlogOpties(username);

    return NextResponse.json({ opties, uid });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
