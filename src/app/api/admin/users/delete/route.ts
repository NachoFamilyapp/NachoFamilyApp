import { NextRequest, NextResponse } from "next/server";
import { vereisBeheerToegang } from "@/lib/adminGuard";
import { verwijderGebruiker } from "@/lib/accounts";

export async function POST(request: NextRequest) {
  const toegang = await vereisBeheerToegang();
  if (!toegang.ok) {
    return NextResponse.json({ error: toegang.error }, { status: toegang.status });
  }

  const { uid } = await request.json();

  if (!uid) {
    return NextResponse.json({ error: "uid is verplicht." }, { status: 400 });
  }

  await verwijderGebruiker(uid);

  return NextResponse.json({ success: true });
}
