import { NextResponse } from "next/server";
import { listBlockingBookings } from "@/lib/bookingStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const bookings = await listBlockingBookings();

  return NextResponse.json(
    {
      periods: bookings.map((booking) => ({
        id: booking.id,
        arrivalDate: booking.arrivalDate,
        departureDate: booking.departureDate,
        status: booking.status,
      })),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    },
  );
}
