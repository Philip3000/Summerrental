import { Bath, BedDouble, Check, UsersRound, Waves } from "lucide-react";
import { motion } from "framer-motion";
import type { SiteCopy } from "@/lib/i18n";

type VillaOverviewProps = {
  content: SiteCopy;
};

const icons = [BedDouble, Bath, UsersRound, Waves];

export default function VillaOverview({ content }: VillaOverviewProps) {
  return (
    <section id="villa" data-header-theme="light" className="bg-porcelain py-20 md:py-28">
      <div className="section-shell grid gap-12 lg:grid-cols-[1fr_0.78fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-sm font-semibold uppercase text-champagne">
            {content.overview.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-olive text-balance md:text-6xl">
            {content.overview.title}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">{content.overview.body}</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {content.overview.items.map((item, index) => {
            const Icon = icons[index] ?? Check;

            return (
              <div
                key={item.label}
                className="rounded-[8px] border border-olive/10 bg-ivory p-5 shadow-line"
              >
                <Icon className="h-5 w-5 text-champagne" aria-hidden="true" />
                <p className="mt-5 font-serif text-5xl text-olive">{item.value}</p>
                <p className="mt-2 text-sm text-ink/62">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section-shell mt-12 grid gap-3 md:grid-cols-4">
        {content.overview.features.map((feature) => (
          <div
            className="flex items-start gap-3 border-t border-olive/12 pt-4 text-sm leading-6 text-ink/72"
            key={feature}
          >
            <Check className="mt-1 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
