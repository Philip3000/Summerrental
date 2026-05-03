import { copy, galleryImages } from "@/lib/i18n";
import { seasonPricing } from "@/lib/pricing";
import type { Language, SiteCopy, SiteCopyByLanguage } from "@/lib/i18n";
import type { SeasonPrice } from "@/lib/pricing";
import type {
  SiteContent,
  SiteImage,
  SiteImageHeight,
  SiteImageLayout,
  SiteImagePresentation,
  SiteImageSlot,
} from "@/types/site";

export const defaultHeroImage =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2200&q=88";

export const defaultExperienceImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=86";

export const defaultLocationImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=86";

const defaultCopy = copy as unknown as SiteCopyByLanguage;

const defaultPresentation: SiteImagePresentation = {
  focalX: 50,
  focalY: 50,
  height: "standard",
  galleryLayout: "standard",
};

function createPresentation(overrides: Partial<SiteImagePresentation> = {}): SiteImagePresentation {
  return {
    ...defaultPresentation,
    ...overrides,
  };
}

export const defaultSiteContent: SiteContent = {
  copy: defaultCopy,
  pricing: seasonPricing,
  images: [
    {
      slot: "hero",
      label: "Hero image",
      src: defaultHeroImage,
      alt: {
        da: "Casa Mimosa private villa med pool",
        en: "Casa Mimosa private villa with pool",
      },
      presentation: createPresentation({ height: "cinematic", focalY: 54 }),
    },
    {
      slot: "experience",
      label: "Interior image",
      src: defaultExperienceImage,
      alt: {
        da: "Varmt designerinterior i en privat villa",
        en: "Warm designer villa interior",
      },
      presentation: createPresentation({ height: "tall" }),
    },
    {
      slot: "location",
      label: "Location image",
      src: defaultLocationImage,
      alt: {
        da: "Costa del Sol kysten ved Fuengirola og Mijas",
        en: "Costa del Sol coastline near Fuengirola and Mijas",
      },
      presentation: createPresentation({ height: "tall", focalY: 45 }),
    },
    ...galleryImages.map<SiteImage>((image, index) => ({
      slot: `gallery-${index + 1}` as SiteImageSlot,
      label: `Gallery image ${index + 1}`,
      src: image.src,
      alt: image.alt,
      presentation: createPresentation({
        galleryLayout: index === 0 ? "feature" : index === 4 ? "wide" : "standard",
      }),
    })),
  ],
};

export function getSiteImage(content: SiteContent | null | undefined, slot: SiteImageSlot) {
  return content?.images.find((image) => image.slot === slot) ??
    defaultSiteContent.images.find((image) => image.slot === slot);
}

function clampPercent(value: unknown) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return 50;
  }

  return Math.min(100, Math.max(0, Math.round(numberValue)));
}

function isImageHeight(value: unknown): value is SiteImageHeight {
  return value === "compact" || value === "standard" || value === "tall" || value === "cinematic";
}

function isGalleryLayout(value: unknown): value is SiteImageLayout {
  return value === "standard" || value === "feature" || value === "wide" || value === "tall";
}

function mergePresentation(
  defaultValue: SiteImagePresentation,
  override: Partial<SiteImagePresentation> | undefined,
) {
  return {
    focalX: clampPercent(override?.focalX ?? defaultValue.focalX),
    focalY: clampPercent(override?.focalY ?? defaultValue.focalY),
    height: isImageHeight(override?.height) ? override.height : defaultValue.height,
    galleryLayout: isGalleryLayout(override?.galleryLayout)
      ? override.galleryLayout
      : defaultValue.galleryLayout,
  };
}

function mergeImage(defaultImage: SiteImage, override: Partial<SiteImage> | undefined) {
  if (!override?.src) {
    return defaultImage;
  }

  return {
    ...defaultImage,
    ...override,
    alt: {
      ...defaultImage.alt,
      ...override.alt,
    },
    presentation: mergePresentation(defaultImage.presentation, override.presentation),
  };
}

function normalizeGalleryImage(image: Partial<SiteImage>, index: number): SiteImage | null {
  if (!image.slot?.startsWith("gallery-") || !image.src) {
    return null;
  }

  const fallback = defaultSiteContent.images.find((item) => item.slot === "gallery-1");

  return mergeImage(
    {
      slot: image.slot,
      label: image.label ?? `Gallery image ${index + 1}`,
      src: fallback?.src ?? defaultHeroImage,
      alt: {
        da: fallback?.alt.da ?? "Casa Mimosa galleri billede",
        en: fallback?.alt.en ?? "Casa Mimosa gallery image",
      },
      presentation: createPresentation({
        galleryLayout: index === 0 ? "feature" : "standard",
      }),
    },
    image,
  );
}

function mergeImages(content: Partial<SiteContent> | null | undefined) {
  const fixedImages = defaultSiteContent.images
    .filter((image) => !image.slot.startsWith("gallery-"))
    .map((defaultImage) => {
      const override = content?.images?.find((image) => image.slot === defaultImage.slot);
      return mergeImage(defaultImage, override);
    });
  const savedGalleryImages = content?.images
    ?.filter((image) => image.slot?.startsWith("gallery-"))
    .map((image, index) => normalizeGalleryImage(image, index))
    .filter(Boolean) as SiteImage[] | undefined;
  const galleryImagesToUse =
    savedGalleryImages?.length
      ? savedGalleryImages
      : defaultSiteContent.images.filter((image) => image.slot.startsWith("gallery-"));

  return [...fixedImages, ...galleryImagesToUse];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeValue<T>(defaultValue: T, override: unknown): T {
  if (typeof defaultValue === "string") {
    return (typeof override === "string" ? override : defaultValue) as T;
  }

  if (typeof defaultValue === "number") {
    return (typeof override === "number" && Number.isFinite(override) ? override : defaultValue) as T;
  }

  if (Array.isArray(defaultValue)) {
    return (Array.isArray(override) && override.length > 0 ? override : defaultValue) as T;
  }

  if (isRecord(defaultValue)) {
    const overrideRecord = isRecord(override) ? override : {};
    return Object.fromEntries(
      Object.entries(defaultValue).map(([key, value]) => [
        key,
        mergeValue(value, overrideRecord[key]),
      ]),
    ) as T;
  }

  return defaultValue;
}

function mergeCopy(content: Partial<SiteContent> | null | undefined): Record<Language, SiteCopy> {
  return {
    da: mergeValue(defaultCopy.da, content?.copy?.da),
    en: mergeValue(defaultCopy.en, content?.copy?.en),
  };
}

function mergePricing(content: Partial<SiteContent> | null | undefined): SeasonPrice[] {
  return seasonPricing.map((defaultSeason) => {
    const override = content?.pricing?.find((season) => season.key === defaultSeason.key);

    if (!override) {
      return defaultSeason;
    }

    return {
      ...defaultSeason,
      ...override,
      dkkPerDay:
        Number.isFinite(Number(override.dkkPerDay)) && Number(override.dkkPerDay) >= 0
          ? Math.round(Number(override.dkkPerDay))
          : defaultSeason.dkkPerDay,
      months:
        Array.isArray(override.months) && override.months.length > 0
          ? Array.from(
              new Set(
                override.months
                  .map((month) => Number(month))
                  .filter((month) => Number.isInteger(month) && month >= 1 && month <= 12),
              ),
            )
          : defaultSeason.months,
      label: {
        ...defaultSeason.label,
        ...override.label,
      },
      period: {
        ...defaultSeason.period,
        ...override.period,
      },
    };
  });
}

export function mergeSiteContent(content: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    images: mergeImages(content),
    copy: mergeCopy(content),
    pricing: mergePricing(content),
    updatedAt: content?.updatedAt,
  };
}

export function getImageObjectPosition(image: SiteImage | null | undefined) {
  return `${clampPercent(image?.presentation?.focalX)}% ${clampPercent(
    image?.presentation?.focalY,
  )}%`;
}

export function getHeroMinHeight(image: SiteImage | null | undefined) {
  const heights: Record<SiteImageHeight, string> = {
    compact: "78svh",
    standard: "88svh",
    tall: "94svh",
    cinematic: "92svh",
  };

  return heights[image?.presentation?.height ?? "standard"];
}

export function getSectionImageMinHeight(image: SiteImage | null | undefined) {
  const heights: Record<SiteImageHeight, string> = {
    compact: "360px",
    standard: "460px",
    tall: "560px",
    cinematic: "640px",
  };

  return heights[image?.presentation?.height ?? "standard"];
}

export function getGalleryLayoutClass(image: SiteImage | null | undefined) {
  switch (image?.presentation?.galleryLayout) {
    case "feature":
      return "md:col-span-2 md:row-span-2";
    case "wide":
      return "md:col-span-2";
    case "tall":
      return "md:row-span-2";
    default:
      return "";
  }
}
