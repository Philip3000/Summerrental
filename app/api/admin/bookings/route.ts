import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { listBookings } from "@/lib/bookingStore";

export const runtime = "nodejs";

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  return NextResponse.json({ bookings: await listBookings() });
}
