import { NextResponse } from "next/server";
import { resolveAccessCodeKind } from "@/lib/accessCodeStore";
import { MINIMUM_STAY_NIGHTS } from "@/lib/bookingRules";
import { createBooking, getSiteContent } from "@/lib/bookingStore";
import { calculateStayEstimate } from "@/lib/pricing";
import { bookingRequestSchema } from "@/lib/validation";
import type { BookingRequestPayload } from "@/types/booking";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    const issues = parsed.error.flatten().fieldErrors;
    const isMinimumStayError = issues.departureDate?.includes("MINIMUM_STAY");
    const isPrivateCodeRequiredError = issues.privateCode?.includes("PRIVATE_CODE_REQUIRED");

    return NextResponse.json(
      {
        success: false,
        code: isMinimumStayError
          ? "MINIMUM_STAY"
          : isPrivateCodeRequiredError
            ? "PRIVATE_CODE_REQUIRED"
            : "INVALID_BOOKING_REQUEST",
        error: isMinimumStayError
          ? `The stay must be at least ${MINIMUM_STAY_NIGHTS} nights.`
          : isPrivateCodeRequiredError
            ? "A private code is required to reserve dates."
            : "Invalid booking request.",
        issues,
      },
      { status: 400 },
    );
  }

  const privateCode = parsed.data.privateCode.trim();
  const privateAccessKind = await resolveAccessCodeKind(privateCode);

  if (privateCode && privateAccessKind === "none") {
    return NextResponse.json(
      {
        success: false,
        code: "INVALID_PRIVATE_CODE",
        error: "The private code could not be used. Please check the code or send without it.",
      },
      { status: 400 },
    );
  }

  const siteContent = await getSiteContent();
  const estimate = calculateStayEstimate(
    parsed.data.arrivalDate,
    parsed.data.departureDate,
    siteContent.pricing,
  );
  const bookingType =
    privateAccessKind === "family"
      ? "private_reservation"
      : privateAccessKind === "friend"
        ? "friend_rental"
        : "public_request";
  const requiresApproval = privateAccessKind !== "family";
  const status =
    privateAccessKind === "family"
      ? "booked"
      : privateAccessKind === "friend"
        ? "reserved"
        : "inquiry";

  const bookingRequest: BookingRequestPayload = {
    language: parsed.data.language,
    name: parsed.data.name,
    email: parsed.data.email,
    arrivalDate: parsed.data.arrivalDate,
    departureDate: parsed.data.departureDate,
    guests: parsed.data.guests,
    message: parsed.data.message ?? "",
    estimatedPriceDkk: privateAccessKind === "family" ? 0 : estimate.total,
    privateAccessKind,
    requiresApproval,
    bookingType,
  };

  const reference = `CM-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();
  let booking;

  try {
    booking = await createBooking({
      ...bookingRequest,
      reference,
      status,
      nights: estimate.nights,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "DATES_NOT_AVAILABLE") {
      return NextResponse.json(
        {
          success: false,
          code: "DATES_NOT_AVAILABLE",
          error: "The selected dates are no longer available.",
        },
        { status: 409 },
      );
    }

    throw error;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[Casa Mimosa] Booking request", {
      reference,
      ownerEmail: process.env.OWNER_EMAIL,
      ...bookingRequest,
    });
  }

  // TODO: Add production email delivery here, for example with Resend and OWNER_EMAIL.
  // Keep this route as the single trusted place for booking request processing.

  return NextResponse.json({
    success: true,
    id: booking.id,
    reference,
    bookingType,
    status,
  });
}
