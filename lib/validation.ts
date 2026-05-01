import { z } from "zod";
import { parseDateInput } from "@/lib/pricing";

const dateInput = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const familyCodeSchema = z.object({
  code: z.string().trim().min(1).max(80),
});

export const bookingRequestSchema = z
  .object({
    language: z.enum(["da", "en"]),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(180),
    arrivalDate: dateInput,
    departureDate: dateInput,
    guests: z.coerce.number().int().min(1).max(8),
    message: z.string().trim().max(2000).optional().default(""),
    estimatedPrice: z.coerce.number().nonnegative().optional(),
    familyAccessUnlocked: z.boolean().default(false),
    bookingType: z.enum(["public_request", "family_reservation"]).default("public_request"),
  })
  .superRefine((value, context) => {
    const arrival = parseDateInput(value.arrivalDate);
    const departure = parseDateInput(value.departureDate);

    if (!arrival || !departure || departure <= arrival) {
      context.addIssue({
        code: "custom",
        path: ["departureDate"],
        message: "Departure date must be after arrival date.",
      });
    }
  });
