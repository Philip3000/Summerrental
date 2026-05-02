import { Car, MapPin, Plane, Utensils } from "lucide-react";
import Image from "next/image";
import type { Language, SiteCopy } from "@/lib/i18n";
import { getSiteImage } from "@/lib/siteContent";
import type { SiteContent } from "@/types/site";

type LocationSectionProps = {
  content: SiteCopy;
  language: Language;
  siteContent: SiteContent;
};

const icons = [MapPin, Utensils, Car, Plane];

export default function LocationSection({ content, language, siteContent }: LocationSectionProps) {
  const image = getSiteImage(siteContent, "location");

  return (
    <section id="location" className="bg-porcelain py-20 md:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-champagne">
            {content.location.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-olive text-balance md:text-6xl">
            {content.location.title}
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/70">{content.location.body}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {content.location.notes.map((note, index) => {
              const Icon = icons[index] ?? MapPin;

              return (
                <div className="border-t border-olive/14 pt-4" key={note}>
                  <Icon className="h-5 w-5 text-champagne" aria-hidden="true" />
                  <p className="mt-3 text-sm leading-6 text-ink/72">{note}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[8px] bg-olive shadow-soft md:min-h-[560px]">
          <Image
            src={image?.src ?? ""}
            alt={image?.alt[language] ?? "Costa del Sol coastline near Fuengirola and Mijas"}
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
