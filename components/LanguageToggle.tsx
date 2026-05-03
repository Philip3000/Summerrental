import type { Language } from "@/lib/i18n";
import { languages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  language: Language;
  theme?: "light" | "dark";
  onLanguageChange: (language: Language) => void;
};

export default function LanguageToggle({
  language,
  theme = "light",
  onLanguageChange,
}: LanguageToggleProps) {
  const isDark = theme === "dark";

  return (
    <div
      aria-label="Language"
      className={cn(
        "inline-flex h-10 items-center rounded-full border px-1 text-sm shadow-line backdrop-blur transition-colors duration-300",
        isDark
          ? "border-ivory/22 bg-ink/24 text-ivory"
          : "border-olive/15 bg-porcelain/82 text-olive",
      )}
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
                ? isDark
                  ? "bg-ivory text-olive"
                  : "bg-olive text-ivory"
                : "text-current/70 hover:text-current",
            )}
          >
            {item.label}
          </button>
          {index === 0 ? <span className="px-1 text-current/28">/</span> : null}
        </div>
      ))}
    </div>
  );
}
