import type { Language } from "@/lib/i18n";

export type BookingType = "public_request" | "family_reservation";

export type BookingRequestPayload = {
  language: Language;
  name: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  guests: number;
  message: string;
  estimatedPrice: number;
  familyAccessUnlocked: boolean;
  bookingType: BookingType;
};
