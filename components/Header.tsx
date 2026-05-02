import LanguageToggle from "@/components/LanguageToggle";
import type { Language, SiteCopy } from "@/lib/i18n";

type HeaderProps = {
  content: SiteCopy;
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export default function Header({
  content,
  language,
  onLanguageChange,
}: HeaderProps) {
  const navItems = [
    ["#villa", content.nav.villa],
    ["#gallery", content.nav.gallery],
    ["#amenities", content.nav.amenities],
    ["#location", content.nav.location],
    ["#pricing", content.nav.pricing],
    ["#booking", content.nav.booking],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ivory/35 bg-porcelain/72 backdrop-blur-xl">
      <div className="section-shell flex h-[var(--header-height)] items-center justify-between gap-4">
        <a href="#" className="group flex min-w-0 items-center gap-3" aria-label="Casa Mimosa">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-champagne/50 bg-olive text-sm font-semibold text-ivory shadow-soft">
            CM
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-xl text-olive">Casa Mimosa</span>
            <span className="hidden text-xs text-olive/62 sm:block">
              Sierrazuela, Fuengirola / Mijas
            </span>
          </span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {navItems.map(([href, label]) => (
            <a
              className="text-sm text-olive/72 transition hover:text-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
        </div>
      </div>
    </header>
  );
}
