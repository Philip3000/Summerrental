import type { Metadata } from "next";
import GuidePage from "@/components/GuidePage";
import { getSiteContent } from "@/lib/bookingStore";
import type { Language } from "@/lib/i18n";
import { getSiteImage } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Inventar | Casa Mimosa",
  description:
    "Oversigt over udstyr og inventar i Casa Mimosa: køkken, vask, grill, pool, terrasse, komfort og praktiske ting til opholdet.",
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

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: GuidePageSearchParams;
}) {
  const params = await searchParams;
  const language = resolveLanguage(params?.lang);
  const siteContent = await getSiteContent();
  const content = siteContent.copy[language].guestGuide.inventory;
  const image = getSiteImage(siteContent, "inventory");

  return (
    <GuidePage
      kind="inventory"
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
