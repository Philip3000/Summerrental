import { motion } from "framer-motion";
import Image from "next/image";
import type { SiteCopy } from "@/lib/i18n";

type HeroProps = {
  content: SiteCopy;
  onFamilyAccessClick: () => void;
};

export default function Hero({ content, onFamilyAccessClick }: HeroProps) {
  return (
    <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-olive pt-[var(--header-height)] text-ivory">
      <Image
        src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2200&q=88"
        alt="Casa Mimosa style Mediterranean villa with private pool"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,37,30,0.76),rgba(32,37,30,0.36)_46%,rgba(32,37,30,0.2)),linear-gradient(180deg,rgba(32,37,30,0.2),rgba(32,37,30,0.68))]" />

      <div className="section-shell relative z-10 pb-10 pt-24 md:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <p className="mb-4 text-sm font-semibold uppercase text-champagne">
            {content.hero.eyebrow}
          </p>
          <h1 className="font-serif text-6xl leading-[1.02] text-balance md:text-8xl">
            {content.hero.title}
          </h1>
          <p className="mt-5 text-base text-ivory/78 md:text-lg">{content.hero.location}</p>
          <p className="mt-5 max-w-2xl text-2xl leading-snug text-ivory md:text-3xl">
            {content.hero.tagline}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#booking"
              className="inline-flex h-12 items-center justify-center rounded-full bg-champagne px-6 text-sm font-bold text-ink shadow-soft transition hover:bg-[#d1b77a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
            >
              {content.hero.primaryCta}
            </a>
            <button
              type="button"
              onClick={onFamilyAccessClick}
              className="inline-flex h-12 items-center justify-center rounded-full border border-ivory/40 bg-ivory/10 px-6 text-sm font-bold text-ivory backdrop-blur transition hover:bg-ivory/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
            >
              {content.hero.familyCta}
            </button>
          </div>
        </motion.div>

        <div className="mt-14 grid max-w-3xl grid-cols-1 gap-3 border-t border-ivory/22 pt-5 text-sm text-ivory/82 sm:grid-cols-3">
          <span>{content.hero.statOne}</span>
          <span>{content.hero.statTwo}</span>
          <span>{content.hero.statThree}</span>
        </div>
      </div>
    </section>
  );
}
