import type { Metadata } from "next";
import GuidePage from "@/components/GuidePage";
import { getSiteContent } from "@/lib/bookingStore";
import type { Language } from "@/lib/i18n";
import { getSiteImage } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Udflugter | Casa Mimosa",
  description:
    "Kuraterede udflugter fra Casa Mimosa: Mijas, Malaga, Ronda, Cordoba, Nerja, Granada, Caminito del Rey og flere officielle links.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type GuidePageSearchParams = Promise<{
  lang?: string | string[];
}>;

function resolveLanguage(value: string | string[] | undefined): Language {
  return (Array.isArray(value) ? value[0] : value) === "en" ? "en" : "da";
}

export default async function ExcursionsPage({
  searchParams,
}: {
  searchParams: GuidePageSearchParams;
}) {
  const params = await searchParams;
  const language = resolveLanguage(params?.lang);
  const siteContent = await getSiteContent();
  const content = siteContent.copy[language].guestGuide.excursions;
  const image = getSiteImage(siteContent, "excursions");

  return (
    <GuidePage
      kind="excursions"
      language={language}
      eyebrow={content.eyebrow}
      title={content.title}
      intro={content.intro}
      image={image?.src ?? ""}
      imageAlt={image?.alt[language] ?? content.imageAlt}
      groups={content.groups}
    />
  );
}
