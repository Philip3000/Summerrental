import type { Language } from "@/lib/i18n";
import type { SiteCopy } from "@/lib/i18n";
import type { SeasonPrice } from "@/lib/pricing";

export type SiteImageSlot =
  | "hero"
  | "experience"
  | `gallery-${string}`;

export type SiteImageHeight = "compact" | "standard" | "tall" | "cinematic";
export type SiteImageLayout = "standard" | "feature" | "wide" | "tall";

export type SiteImagePresentation = {
  focalX: number;
  focalY: number;
  height: SiteImageHeight;
  galleryLayout: SiteImageLayout;
};

export type SiteImage = {
  slot: SiteImageSlot;
  label: string;
  src: string;
  alt: Record<Language, string>;
  presentation: SiteImagePresentation;
};

export type SiteContent = {
  images: SiteImage[];
  copy: Record<Language, SiteCopy>;
  pricing: SeasonPrice[];
  updatedAt?: string;
};
