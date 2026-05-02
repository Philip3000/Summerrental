import Image from "next/image";
import type { Language, SiteCopy } from "@/lib/i18n";
import type { SiteContent } from "@/types/site";

type GalleryProps = {
  content: SiteCopy;
  language: Language;
  siteContent: SiteContent;
};

export default function Gallery({ content, language, siteContent }: GalleryProps) {
  const galleryImages = siteContent.images.filter((image) => image.slot.startsWith("gallery-"));

  return (
    <section id="gallery" className="bg-porcelain py-20 md:py-28">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-champagne">
              {content.gallery.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-olive text-balance md:text-6xl">
              {content.gallery.title}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ink/68 lg:justify-self-end">
            {content.gallery.body}
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[260px] gap-4 md:grid-cols-4 md:auto-rows-[220px] lg:auto-rows-[260px]">
          {galleryImages.map((image, index) => (
            <figure
              key={image.src}
              className={[
                "relative overflow-hidden rounded-[8px] bg-sand shadow-line",
                index === 0 ? "md:col-span-2 md:row-span-2" : "",
                index === 4 ? "md:col-span-2" : "",
              ].join(" ")}
            >
              <Image
                src={image.src}
                alt={image.alt[language]}
                fill
                sizes={index === 0 ? "(min-width: 768px) 50vw, 100vw" : "50vw"}
                className="object-cover transition duration-700 hover:scale-[1.025]"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
