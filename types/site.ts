import type { Language } from "@/lib/i18n";

export type SiteImageSlot =
  | "hero"
  | "experience"
  | "location"
  | "gallery-1"
  | "gallery-2"
  | "gallery-3"
  | "gallery-4"
  | "gallery-5";

export type SiteImage = {
  slot: SiteImageSlot;
  label: string;
  src: string;
  alt: Record<Language, string>;
};

export type SiteContent = {
  images: SiteImage[];
  updatedAt?: string;
};
