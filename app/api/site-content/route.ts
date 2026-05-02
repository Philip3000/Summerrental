import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/bookingStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const siteContent = await getSiteContent();

  return NextResponse.json(siteContent, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}