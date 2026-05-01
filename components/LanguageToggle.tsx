import type { Language } from "@/lib/i18n";
import { languages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export default function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  return (
    <div
      aria-label="Language"
      className="inline-flex h-10 items-center rounded-full border border-olive/15 bg-porcelain/82 px-1 text-sm shadow-line backdrop-blur"
    >
      {languages.map((item, index) => (
        <div className="flex items-center" key={item.code}>
          <button
            type="button"
            aria-pressed={language === item.code}
            onClick={() => onLanguageChange(item.code)}
            className={cn(
              "h-8 rounded-full px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
              language === item.code
                ? "bg-olive text-ivory"
                : "text-olive/70 hover:text-olive",
            )}
          >
            {item.label}
          </button>
          {index === 0 ? <span className="px-1 text-olive/28">/</span> : null}
        </div>
      ))}
    </div>
  );
}
