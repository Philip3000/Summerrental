import { ArrowRight, Flag, MapPin, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Language, SiteCopy } from "@/lib/i18n";
import { getImageObjectPosition, getSiteImage } from "@/lib/siteContent";
import type { SiteContent, SiteImage } from "@/types/site";

type ActivitiesSectionProps = {
  content: SiteCopy;
  language: Language;
  siteContent: SiteContent;
};

function activitiesHref(language: Language) {
  return language === "en" ? "/aktiviteter?lang=en" : "/aktiviteter";
}

export default function ActivitiesSection({
  content,
  language,
  siteContent,
}: ActivitiesSectionProps) {
  const activitiesImage = getSiteImage(siteContent, "activities");
  const golfImage = getSiteImage(siteContent, "golf");
  const teaser = content.guestGuideTeaser;
  const activities = content.guestGuide.activities;

  return (
    <section id="activities" data-header-theme="light" className="bg-ivory py-20 md:py-28">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-champagne">
              {teaser.eyebrow}
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-olive text-balance md:text-6xl">
              {teaser.activitiesTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
              {teaser.activitiesBody}
            </p>
            <Link
              href={activitiesHref(language)}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-olive px-5 text-sm font-bold text-ivory transition hover:bg-dusk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
            >
              {teaser.activitiesCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ActivityCard
              href={`${activitiesHref(language)}#golf`}
              image={golfImage}
              alt={golfImage?.alt[language] ?? activities.golf.imageAlt}
              eyebrow={activities.golf.eyebrow}
              title={activities.golf.title}
              body={activities.golf.intro}
              guideLabel={activities.eyebrow}
              icon={<Trophy className="h-5 w-5" aria-hidden="true" />}
            />
            <ActivityCard
              href={`${activitiesHref(language)}#other-activities`}
              image={activitiesImage}
              alt={activitiesImage?.alt[language] ?? activities.imageAlt}
              eyebrow={activities.other.eyebrow}
              title={activities.other.title}
              body={activities.other.description}
              guideLabel={activities.eyebrow}
              icon={<Flag className="h-5 w-5" aria-hidden="true" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityCard({
  alt,
  body,
  eyebrow,
  href,
  icon,
  image,
  guideLabel,
  title,
}: {
  alt: string;
  body: string;
  eyebrow: string;
  href: string;
  icon: ReactNode;
  image: SiteImage | undefined;
  guideLabel: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-[8px] border border-olive/10 bg-porcelain shadow-line transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
    >
      <div className="relative h-[280px] overflow-hidden bg-sand">
        {image?.src ? (
          <Image
            src={image.src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 26vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.025]"
            style={{ objectPosition: getImageObjectPosition(image) }}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(32,37,30,0.02),rgba(32,37,30,0.26))]" />
      </div>
      <div className="flex min-h-[260px] flex-col justify-between p-6">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory">
            {icon}
          </div>
          <p className="mt-5 text-xs font-bold uppercase text-champagne">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-serif text-3xl leading-tight text-olive">
            {title}
          </h3>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-ink/66">{body}</p>
        </div>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-olive">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {guideLabel}
        </span>
      </div>
    </Link>
  );
}
