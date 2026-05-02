import { z } from "zod";
import { parseDateInput } from "@/lib/dateRanges";

const dateInput = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const bookingRequestSchema = z
  .object({
    language: z.enum(["da", "en"]),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(180),
    arrivalDate: dateInput,
    departureDate: dateInput,
    guests: z.coerce.number().int().min(1).max(8),
    message: z.string().trim().max(2000).optional().default(""),
    privateCode: z.string().trim().max(80).optional().default(""),
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

export const adminLoginSchema = z.object({
  idToken: z.string().min(20),
});

export const bookingActionSchema = z.object({
  action: z.enum(["approve", "deny", "cancel"]),
  adminNote: z.string().trim().max(1000).optional().default(""),
});

const siteImageSlotSchema = z.enum([
  "hero",
  "experience",
  "location",
  "gallery-1",
  "gallery-2",
  "gallery-3",
  "gallery-4",
  "gallery-5",
]);

export const siteContentSchema = z.object({
  images: z
    .array(
      z.object({
        slot: siteImageSlotSchema,
        label: z.string().trim().min(1).max(80),
        src: z.string().trim().url().max(2000),
        alt: z.object({
          da: z.string().trim().min(1).max(300),
          en: z.string().trim().min(1).max(300),
        }),
      }),
    )
    .min(1),
});

export const accessCodeCreateSchema = z.object({
  label: z.string().trim().min(2).max(120),
  kind: z.enum(["friend", "family"]),
  code: z.string().trim().min(4).max(120),
});
