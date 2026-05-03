import type { Language, SiteCopy } from "@/lib/i18n";
import { formatDkk } from "@/lib/pricing";
import type { SeasonPrice } from "@/lib/pricing";

type PricingProps = {
  content: SiteCopy;
  language: Language;
  pricing: SeasonPrice[];
};

export default function Pricing({ content, language, pricing }: PricingProps) {
  return (
    <section id="pricing" data-header-theme="dark" className="bg-olive py-20 text-ivory md:py-28">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-champagne">
              {content.pricing.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-balance md:text-6xl">
              {content.pricing.title}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ivory/72 lg:justify-self-end">
            {content.pricing.body}
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {pricing.map((season) => (
            <article
              key={season.key}
              className="rounded-[8px] border border-ivory/14 bg-ivory/[0.07] p-6 shadow-line backdrop-blur"
            >
              <p className="text-sm text-champagne">{season.label[language]}</p>
              <p className="mt-3 text-sm text-ivory/58">{season.period[language]}</p>
              <p className="mt-8 font-serif text-4xl text-ivory">
                {content.pricing.from} {formatDkk(season.dkkPerDay)}
              </p>
              <p className="mt-2 text-sm text-ivory/58">/ {content.pricing.perDay}</p>
            </article>
          ))}
        </div>

        <div className="premium-rule mt-10" />
        <p className="mt-6 max-w-2xl text-sm leading-6 text-ivory/66">{content.pricing.note}</p>
      </div>
    </section>
  );
}
