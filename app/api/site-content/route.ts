import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/bookingStore";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getSiteContent());
}
