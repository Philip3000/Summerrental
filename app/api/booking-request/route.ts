import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  FAMILY_ACCESS_COOKIE,
  getConfiguredFamilyCode,
  isFamilyAccessTokenValid,
} from "@/lib/familyAccess";
import { calculateStayEstimate } from "@/lib/pricing";
import { bookingRequestSchema } from "@/lib/validation";
import type { BookingRequestPayload } from "@/types/booking";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid booking request.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const configuredCode = getConfiguredFamilyCode();
  const cookieStore = await cookies();
  const familyToken = cookieStore.get(FAMILY_ACCESS_COOKIE)?.value;
  const familyAccessUnlocked =
    Boolean(configuredCode) && isFamilyAccessTokenValid(familyToken, configuredCode);

  if (parsed.data.familyAccessUnlocked && !familyAccessUnlocked) {
    return NextResponse.json(
      {
        success: false,
        error: "Family access is no longer active. Please validate the code again.",
      },
      { status: 403 },
    );
  }

  const estimate = calculateStayEstimate(parsed.data.arrivalDate, parsed.data.departureDate);
  const bookingType = familyAccessUnlocked ? "family_reservation" : "public_request";

  const bookingRequest: BookingRequestPayload = {
    language: parsed.data.language,
    name: parsed.data.name,
    email: parsed.data.email,
    arrivalDate: parsed.data.arrivalDate,
    departureDate: parsed.data.departureDate,
    guests: parsed.data.guests,
    message: parsed.data.message ?? "",
    estimatedPrice: familyAccessUnlocked ? 0 : estimate.total,
    familyAccessUnlocked,
    bookingType,
  };

  const reference = `CM-${Date.now().toString(36).toUpperCase()}`;

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
    reference,
    bookingType,
    estimatedPrice: bookingRequest.estimatedPrice,
  });
}
