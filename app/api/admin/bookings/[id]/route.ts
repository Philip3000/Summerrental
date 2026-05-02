import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/apiAuth";
import { updateBookingStatus } from "@/lib/bookingStore";
import { bookingActionSchema } from "@/lib/validation";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json().catch(() => null);
  const parsed = bookingActionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  }

  try {
    const { id } = await params;
    const booking = await updateBookingStatus(
      id,
      parsed.data.action,
      parsed.data.adminNote,
    );

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    if (error instanceof Error && error.message === "DATES_NOT_AVAILABLE") {
      return NextResponse.json(
        { success: false, error: "Those dates are no longer available." },
        { status: 409 },
      );
    }

    if (error instanceof Error && error.message === "BOOKING_NOT_FOUND") {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    throw error;
  }
}
