import type { Metadata } from "next";
import GuidePage from "@/components/GuidePage";
import { getSiteContent } from "@/lib/bookingStore";
import type { Language } from "@/lib/i18n";
import { getSiteImage } from "@/lib/siteContent";

export const metadata: Metadata = {
  title: "Aktiviteter | Casa Mimosa",
  description:
    "Aktiviteter fra Casa Mimosa: golfbaner nær Mijas og Fuengirola, kystbyer, kultur, dagsture og officielle links.",
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

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: GuidePageSearchParams;
}) {
  const params = await searchParams;
  const language = resolveLanguage(params?.lang);
  const siteContent = await getSiteContent();
  const content = siteContent.copy[language].guestGuide.activities;
  const image = getSiteImage(siteContent, "activities");
  const golfImage = getSiteImage(siteContent, "golf");

  return (
    <GuidePage
      kind="activities"
      language={language}
      content={content}
      image={image?.src ?? ""}
      imageAlt={image?.alt[language] ?? content.imageAlt}
      golfImage={golfImage?.src ?? "/golf-ball-club-casa-mimosa.png"}
      golfImageAlt={golfImage?.alt[language] ?? content.golf.imageAlt}
    />
  );
}
