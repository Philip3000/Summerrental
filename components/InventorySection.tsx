import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Language, SiteCopy } from "@/lib/i18n";
import { getImageObjectPosition, getSiteImage } from "@/lib/siteContent";
import type { SiteContent } from "@/types/site";

type InventorySectionProps = {
  content: SiteCopy;
  language: Language;
  siteContent: SiteContent;
};

function inventoryHref(language: Language) {
  return language === "en" ? "/inventar?lang=en" : "/inventar";
}

export default function InventorySection({
  content,
  language,
  siteContent,
}: InventorySectionProps) {
  const inventory = content.guestGuide.inventory;
  const inventoryImage = getSiteImage(siteContent, "inventory");

  return (
    <section id="inventory" data-header-theme="light" className="bg-porcelain py-20 md:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.86fr_1fr] lg:items-start">
        <div className="relative min-h-[520px] overflow-hidden rounded-[8px] bg-sand shadow-soft">
          {inventoryImage?.src ? (
            <Image
              src={inventoryImage.src}
              alt={inventoryImage.alt[language] ?? inventory.imageAlt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: getImageObjectPosition(inventoryImage) }}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(32,37,30,0.04),rgba(32,37,30,0.22))]" />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase text-champagne">
            {inventory.sectionEyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-olive text-balance md:text-6xl">
            {inventory.sectionTitle}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            {inventory.sectionBody}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {inventory.groups.slice(0, 6).map((group) => (
              <article
                key={group.title}
                className="rounded-[8px] border border-olive/10 bg-ivory p-4 shadow-line"
              >
                <h3 className="font-serif text-2xl leading-tight text-olive">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.items.slice(0, 3).map((item) => (
                    <li className="flex gap-2 text-sm leading-6 text-ink/66" key={item}>
                      <Check className="mt-1 h-4 w-4 shrink-0 text-champagne" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <Link
            href={inventoryHref(language)}
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-olive px-5 text-sm font-bold text-ivory transition hover:bg-dusk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
          >
            {inventory.sectionCta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
