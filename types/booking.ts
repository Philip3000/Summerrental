import type { Language } from "@/lib/i18n";
import type { PrivateAccessKind } from "@/lib/privateAccess";

export type BookingType = "public_request" | "friend_rental" | "private_reservation";
export type BookingStatus = "inquiry" | "reserved" | "booked" | "denied" | "cancelled";

export type BookingRequestPayload = {
  language: Language;
  name: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  guests: number;
  message: string;
  estimatedPriceDkk: number;
  privateAccessKind: PrivateAccessKind;
  requiresApproval: boolean;
  bookingType: BookingType;
};

export type BookingRecord = BookingRequestPayload & {
  id: string;
  reference: string;
  status: BookingStatus;
  nights: number;
  createdAt: string;
  updatedAt: string;
  decidedAt?: string;
  adminNote?: string;
};

export type PublicAvailabilityPeriod = {
  arrivalDate: string;
  departureDate: string;
  status: Extract<BookingStatus, "reserved" | "booked">;
};

export type BookingAdminAction = "approve" | "deny" | "cancel";
