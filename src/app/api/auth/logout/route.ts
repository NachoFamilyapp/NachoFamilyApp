import { NextResponse } from "next/server";
import { wisSessieCookie } from "@/lib/session";

export async function POST() {
  await wisSessieCookie();
  return NextResponse.json({ success: true });
}
