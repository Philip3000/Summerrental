import { NextResponse } from "next/server";
import { listBlockingBookings } from "@/lib/bookingStore";

export const runtime = "nodejs";

export async function GET() {
  const bookings = await listBlockingBookings();

  return NextResponse.json({
    periods: bookings.map((booking) => ({
      id: booking.id,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate,
      status: booking.status,
    })),
  });
}
