import { galleryImages } from "@/lib/i18n";
import type { SiteContent, SiteImage, SiteImageSlot } from "@/types/site";

export const defaultHeroImage =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2200&q=88";

export const defaultExperienceImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=86";

export const defaultLocationImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=86";

export const defaultSiteContent: SiteContent = {
  images: [
    {
      slot: "hero",
      label: "Hero image",
      src: defaultHeroImage,
      alt: {
        da: "Casa Mimosa inspireret middelhavsvilla med privat pool",
        en: "Casa Mimosa style Mediterranean villa with private pool",
      },
    },
    {
      slot: "experience",
      label: "Interior image",
      src: defaultExperienceImage,
      alt: {
        da: "Varmt designerinteriør i en privat villa",
        en: "Warm designer villa interior",
      },
    },
    {
      slot: "location",
      label: "Location image",
      src: defaultLocationImage,
      alt: {
        da: "Costa del Sol kysten nær Fuengirola og Mijas",
        en: "Costa del Sol coastline near Fuengirola and Mijas",
      },
    },
    ...galleryImages.map<SiteImage>((image, index) => ({
      slot: `gallery-${index + 1}` as SiteImageSlot,
      label: `Gallery image ${index + 1}`,
      src: image.src,
      alt: image.alt,
    })),
  ],
};

export function getSiteImage(content: SiteContent | null | undefined, slot: SiteImageSlot) {
  return content?.images.find((image) => image.slot === slot) ??
    defaultSiteContent.images.find((image) => image.slot === slot);
}

export function mergeSiteContent(content: Partial<SiteContent> | null | undefined): SiteContent {
  if (!content?.images?.length) {
    return defaultSiteContent;
  }

  const images = defaultSiteContent.images.map((defaultImage) => {
    const override = content.images?.find((image) => image.slot === defaultImage.slot);
    return override?.src ? { ...defaultImage, ...override } : defaultImage;
  });

  return {
    images,
    updatedAt: content.updatedAt,
  };
}
