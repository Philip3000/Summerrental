import { ArrowRight, ListChecks, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Language, SiteCopy } from "@/lib/i18n";
import { getImageObjectPosition, getSiteImage } from "@/lib/siteContent";
import type { SiteContent, SiteImage } from "@/types/site";

type GuestGuideTeasersProps = {
  content: SiteCopy;
  language: Language;
  siteContent: SiteContent;
};

function guideHref(path: "/udflugter" | "/inventar", language: Language) {
  return language === "en" ? `${path}?lang=en` : path;
}

export default function GuestGuideTeasers({
  content,
  language,
  siteContent,
}: GuestGuideTeasersProps) {
  const excursionsImage = getSiteImage(siteContent, "excursions");
  const inventoryImage = getSiteImage(siteContent, "inventory");
  const teaser = content.guestGuideTeaser;

  const cards = [
    {
      href: guideHref("/udflugter", language),
      title: teaser.excursionsTitle,
      body: teaser.excursionsBody,
      cta: teaser.excursionsCta,
      image: excursionsImage,
      alt: excursionsImage?.alt[language] ?? content.guestGuide.excursions.imageAlt,
      Icon: Map,
    },
    {
      href: guideHref("/inventar", language),
      title: teaser.inventoryTitle,
      body: teaser.inventoryBody,
      cta: teaser.inventoryCta,
      image: inventoryImage,
      alt: inventoryImage?.alt[language] ?? content.guestGuide.inventory.imageAlt,
      Icon: ListChecks,
    },
  ];

  return (
    <section id="guest-guide" data-header-theme="light" className="bg-ivory py-20 md:py-28">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-champagne">
              {teaser.eyebrow}
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-olive text-balance md:text-6xl">
              {teaser.title}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ink/68 lg:justify-self-end">
            {teaser.body}
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {cards.map(({ Icon, alt, body, cta, href, image, title }) => (
            <Link
              href={href}
              key={href}
              className="group overflow-hidden rounded-[8px] border border-olive/10 bg-porcelain shadow-line transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
            >
              <GuideImage image={image} alt={alt} />
              <div className="flex min-h-[220px] flex-col justify-between p-6 md:p-8">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-serif text-3xl leading-tight text-olive md:text-4xl">
                    {title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-ink/68">{body}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-olive">
                  {cta}
                  <ArrowRight
                    className="h-4 w-4 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideImage({
  alt,
  image,
}: {
  alt: string;
  image: SiteImage | undefined;
}) {
  if (!image?.src) {
    return <div className="h-[300px] bg-sand" aria-hidden="true" />;
  }

  return (
    <div className="relative h-[300px] overflow-hidden bg-sand md:h-[360px]">
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition duration-700 group-hover:scale-[1.025]"
        style={{ objectPosition: getImageObjectPosition(image) }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(32,37,30,0.05),rgba(32,37,30,0.2))]" />
    </div>
  );
}
