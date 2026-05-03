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

const siteImageSlotSchema = z.union([
  z.enum(["hero", "experience", "location"]),
  z.string().regex(/^gallery-[a-z0-9-]+$/),
]);

const siteImageHeightSchema = z.enum(["compact", "standard", "tall", "cinematic"]);
const siteImageLayoutSchema = z.enum(["standard", "feature", "wide", "tall"]);

const localizedTextSchema = z.object({
  da: z.string().trim().min(1).max(500),
  en: z.string().trim().min(1).max(500),
});

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
        presentation: z
          .object({
            focalX: z.coerce.number().min(0).max(100),
            focalY: z.coerce.number().min(0).max(100),
            height: siteImageHeightSchema,
            galleryLayout: siteImageLayoutSchema,
          }),
      }),
    )
    .min(1)
    .optional(),
  copy: z
    .object({
      da: z.unknown(),
      en: z.unknown(),
    })
    .optional(),
  pricing: z
    .array(
      z.object({
        key: z.enum(["low", "mid", "high", "peak"]),
        dkkPerDay: z.coerce.number().int().min(0).max(50000),
        months: z.array(z.coerce.number().int().min(1).max(12)).min(1).max(12),
        label: localizedTextSchema,
        period: localizedTextSchema,
      }),
    )
    .length(4)
    .optional(),
});

export const accessCodeCreateSchema = z.object({
  label: z.string().trim().min(2).max(120),
  kind: z.enum(["friend", "family"]),
  code: z.string().trim().min(4).max(120),
});
