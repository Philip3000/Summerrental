import {
  ArrowLeft,
  Check,
  ExternalLink,
  Flag,
  MapPin,
  Navigation,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { inventoryIcons } from "@/lib/guestGuide";
import type { Language, SiteCopy } from "@/lib/i18n";

type GuideLabels = {
  activities: string;
  back: string;
  inventory: string;
  openGuide: string;
  officialSite: string;
  viewMap: string;
};

const guideLabels: Record<Language, GuideLabels> = {
  da: {
    activities: "Aktiviteter",
    back: "Casa Mimosa",
    inventory: "Inventar",
    openGuide: "Åbn guide",
    officialSite: "Officiel side",
    viewMap: "Kort",
  },
  en: {
    activities: "Activities",
    back: "Casa Mimosa",
    inventory: "Inventory",
    openGuide: "Open guide",
    officialSite: "Official site",
    viewMap: "Map",
  },
};

function guideHref(path: "/aktiviteter" | "/inventar", language: Language) {
  return language === "en" ? `${path}?lang=en` : path;
}

function googleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function googleMapsEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

type GuidePageProps =
  | {
      kind: "activities";
      language: Language;
      content: SiteCopy["guestGuide"]["activities"];
      image: string;
      imageAlt: string;
      golfImage: string;
      golfImageAlt: string;
    }
  | {
      kind: "inventory";
      language: Language;
      content: SiteCopy["guestGuide"]["inventory"];
      image: string;
      imageAlt: string;
    };

export default function GuidePage(props: GuidePageProps) {
  const labels = guideLabels[props.language];

  return (
    <main className="min-h-screen bg-ivory text-ink">
      <section className="relative min-h-[520px] overflow-hidden bg-olive text-ivory">
        <Image
          src={props.image}
          alt={props.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,37,30,0.78),rgba(32,37,30,0.42)_54%,rgba(32,37,30,0.2)),linear-gradient(180deg,rgba(32,37,30,0.14),rgba(32,37,30,0.72))]" />
        <div className="section-shell relative z-10 flex min-h-[520px] flex-col justify-between py-8">
          <nav
            className="flex flex-wrap items-center justify-between gap-3"
            aria-label="Guide navigation"
          >
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ivory/35 bg-ivory/10 px-4 text-sm font-bold text-ivory backdrop-blur transition hover:bg-ivory/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {labels.back}
            </Link>
            <div className="flex flex-wrap gap-2">
              <GuideTab
                href={guideHref("/aktiviteter", props.language)}
                active={props.kind === "activities"}
              >
                {labels.activities}
              </GuideTab>
              <GuideTab
                href={guideHref("/inventar", props.language)}
                active={props.kind === "inventory"}
              >
                {labels.inventory}
              </GuideTab>
            </div>
          </nav>

          <div className="max-w-4xl pb-4 pt-20">
            <p className="text-sm font-semibold uppercase text-champagne">
              {props.content.eyebrow}
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.04] text-balance md:text-7xl">
              {props.content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/78 md:text-xl">
              {props.content.intro}
            </p>
          </div>
        </div>
      </section>

      {props.kind === "activities" ? (
        <ActivitiesGuide
          content={props.content}
          golfImage={props.golfImage}
          golfImageAlt={props.golfImageAlt}
          labels={labels}
        />
      ) : (
        <InventoryGuide groups={props.content.groups} />
      )}
    </main>
  );
}

function GuideTab({
  active,
  children,
  href,
}: {
  active: boolean;
  children: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex h-11 items-center justify-center rounded-full border px-4 text-sm font-bold backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory",
        active
          ? "border-champagne bg-champagne text-ink"
          : "border-ivory/28 bg-ivory/10 text-ivory hover:bg-ivory/18",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function ActivitiesGuide({
  content,
  golfImage,
  golfImageAlt,
  labels,
}: {
  content: SiteCopy["guestGuide"]["activities"];
  golfImage: string;
  golfImageAlt: string;
  labels: GuideLabels;
}) {
  return (
    <>
      <section className="bg-ivory py-16 md:py-24" id="golf">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-champagne">
                {content.golf.eyebrow}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-olive text-balance md:text-6xl">
                {content.golf.title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
                {content.golf.intro}
              </p>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-[8px] bg-sand shadow-soft md:min-h-[460px]">
              <Image
                src={golfImage}
                alt={golfImageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(32,37,30,0.04),rgba(32,37,30,0.24))]" />
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[0.86fr_1fr]">
            <div className="overflow-hidden rounded-[8px] border border-olive/10 bg-porcelain p-3 shadow-line">
              <div className="relative min-h-[420px] overflow-hidden rounded-[8px] bg-sand">
                <iframe
                  title={content.golf.mapTitle}
                  src={googleMapsEmbedUrl(content.golf.mapQuery)}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex flex-col gap-3 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-champagne">
                    {content.golf.mapTitle}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink/62">
                    {content.golf.mapBody}
                  </p>
                </div>
                <a
                  href={googleMapsUrl(content.golf.mapQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-olive/15 px-4 text-sm font-bold text-olive transition hover:border-champagne hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                >
                  {content.golf.mapCta}
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {content.golf.courses.map((course) => (
                <article
                  key={course.title}
                  className="flex min-h-[230px] flex-col justify-between rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line"
                >
                  <div>
                    <p className="text-xs font-bold uppercase text-champagne">
                      {course.eyebrow}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl leading-tight text-olive">
                      {course.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-ink/66">
                      {course.description}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <a
                      href={course.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-olive px-4 text-sm font-bold text-ivory transition hover:bg-dusk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                    >
                      {labels.officialSite}
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a
                      href={googleMapsUrl(course.mapQuery)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-olive/15 px-4 text-sm font-bold text-olive transition hover:border-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                    >
                      {labels.viewMap}
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-porcelain py-16 md:py-24" id="other-activities">
        <div className="section-shell space-y-14">
          <div className="grid gap-6 lg:grid-cols-[0.45fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-champagne">
                {content.other.eyebrow}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-olive md:text-6xl">
                {content.other.title}
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-ink/68 lg:justify-self-end">
              {content.other.description}
            </p>
          </div>

          {content.other.groups.map((group) => (
            <div key={group.title}>
              <div className="grid gap-4 lg:grid-cols-[0.42fr_1fr] lg:items-end">
                <div>
                  <Flag className="h-5 w-5 text-champagne" aria-hidden="true" />
                  <h3 className="mt-3 font-serif text-4xl leading-tight text-olive">
                    {group.title}
                  </h3>
                </div>
                <p className="max-w-2xl text-base leading-7 text-ink/64 lg:justify-self-end">
                  {group.description}
                </p>
              </div>
              <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-h-[210px] flex-col justify-between rounded-[8px] border border-olive/10 bg-ivory p-5 shadow-line transition hover:-translate-y-0.5 hover:border-champagne/45 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                  >
                    <span>
                      <span className="text-xs font-bold uppercase text-champagne">
                        {link.eyebrow}
                      </span>
                      <span className="mt-3 block font-serif text-3xl leading-tight text-olive">
                        {link.title}
                      </span>
                      <span className="mt-4 block text-sm leading-6 text-ink/66">
                        {link.description}
                      </span>
                    </span>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-olive">
                      {labels.openGuide}
                      <ExternalLink
                        className="h-4 w-4 transition group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function InventoryGuide({
  groups,
}: {
  groups: SiteCopy["guestGuide"]["inventory"]["groups"];
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="section-shell">
        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map((group, index) => {
            const Icon = inventoryIcons[index] ?? inventoryIcons[0]!;

            return (
              <article
                key={group.title}
                className="rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line md:p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-olive text-ivory">
                    <Icon className="h-5 w-5" aria-hidden={true} />
                  </span>
                  <div>
                    <h2 className="font-serif text-3xl leading-tight text-olive">
                      {group.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-ink/62">
                      {group.description}
                    </p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <li className="flex gap-3 text-sm leading-6 text-ink/72" key={item}>
                      <Check className="mt-1 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
