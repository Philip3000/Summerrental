import type { SiteCopy } from "@/lib/i18n";

type FooterProps = {
  content: SiteCopy;
};

export default function Footer({ content }: FooterProps) {
  return (
    <footer data-header-theme="dark" className="bg-dusk py-12 text-ivory">
      <div className="section-shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-3xl">{content.footer.title}</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ivory/64">{content.footer.body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#booking"
            className="inline-flex h-11 items-center justify-center rounded-full bg-champagne px-5 text-sm font-bold text-ink transition hover:bg-[#d1b77a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
          >
            {content.footer.booking}
          </a>
        </div>
      </div>
    </footer>
  );
}
