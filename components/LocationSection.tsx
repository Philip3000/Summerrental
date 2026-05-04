import { Car, ExternalLink, Flag, MapPin, Plane, Utensils, Waves } from "lucide-react";
import type { SiteCopy } from "@/lib/i18n";

type LocationSectionProps = {
  content: SiteCopy;
};

const icons = [MapPin, Utensils, Car, Plane];
const areaIcons = [Waves, Utensils, Flag, Car];
const defaultMapAddress = "Calle Mimosa De Sierrezuela 16, Mijas, Spain";

export default function LocationSection({ content }: LocationSectionProps) {
  const mapAddress = content.location.address || defaultMapAddress;
  const encodedMapAddress = encodeURIComponent(mapAddress);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedMapAddress}`;
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodedMapAddress}&output=embed`;

  return (
    <section id="location" data-header-theme="light" className="bg-porcelain py-20 md:py-28">
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
          <div className="mt-10 rounded-[8px] border border-olive/10 bg-ivory p-5 shadow-line">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">
              {content.location.areaEyebrow}
            </p>
            <h3 className="mt-3 font-serif text-3xl leading-tight text-olive">
              {content.location.areaTitle}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {content.location.areaItems.map((item, index) => {
                const Icon = areaIcons[index] ?? MapPin;

                return (
                  <article className="border-t border-olive/12 pt-4" key={item.title}>
                    <Icon className="h-5 w-5 text-champagne" aria-hidden="true" />
                    <h4 className="mt-3 text-sm font-bold uppercase text-olive">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-ink/68">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-olive/10 bg-ivory p-3 shadow-soft">
          <div className="relative min-h-[440px] overflow-hidden rounded-[8px] bg-sand">
            <iframe
              title="Casa Mimosa location on Google Maps"
              src={googleMapsEmbedUrl}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex flex-col gap-3 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-champagne">
                {content.location.mapLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-olive">{mapAddress}</p>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-olive/15 px-4 text-sm font-bold text-olive transition hover:border-champagne hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
            >
              {content.location.mapCta}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
