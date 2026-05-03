"use client";

import { useEffect, useRef, useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import type { Language, SiteCopy } from "@/lib/i18n";

type HeaderProps = {
  content: SiteCopy;
  language: Language;
  onLanguageChange: (language: Language) => void;
};

type HeaderTheme = "light" | "dark";
type Rgba = { r: number; g: number; b: number; a: number };

function parseCssColors(value: string): Rgba[] {
  return Array.from(value.matchAll(/rgba?\(([^)]+)\)/g))
    .map((match) => {
      const numbers = match[1]
        .match(/[\d.]+/g)
        ?.map((item) => Number(item));

      if (!numbers || numbers.length < 3) {
        return null;
      }

      return {
        r: numbers[0],
        g: numbers[1],
        b: numbers[2],
        a: numbers[3] ?? 1,
      };
    })
    .filter(Boolean) as Rgba[];
}

function colorLuminance(color: Rgba) {
  const toLinear = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * toLinear(color.r) + 0.7152 * toLinear(color.g) + 0.0722 * toLinear(color.b);
}

function averageColorLuminance(colors: Rgba[]) {
  const usableColors = colors.filter((color) => color.a > 0.08);

  if (!usableColors.length) {
    return null;
  }

  const weightedTotal = usableColors.reduce(
    (sum, color) => sum + colorLuminance(color) * color.a,
    0,
  );
  const alphaTotal = usableColors.reduce((sum, color) => sum + color.a, 0);

  return weightedTotal / alphaTotal;
}

function parsePositionPart(value: string | undefined) {
  if (!value) {
    return 0.5;
  }

  if (value.endsWith("%")) {
    return Number.parseFloat(value) / 100;
  }

  if (value === "left" || value === "top") {
    return 0;
  }

  if (value === "right" || value === "bottom") {
    return 1;
  }

  return 0.5;
}

function sampleImageLuminance(image: HTMLImageElement, x: number, y: number) {
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) {
    return null;
  }

  const rect = image.getBoundingClientRect();

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    return null;
  }

  const styles = getComputedStyle(image);
  const objectFit = styles.objectFit || "fill";
  const [positionX, positionY] = styles.objectPosition.split(" ");
  let renderedWidth = rect.width;
  let renderedHeight = rect.height;

  if (objectFit === "cover" || objectFit === "contain") {
    const scale =
      objectFit === "cover"
        ? Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
        : Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
    renderedWidth = image.naturalWidth * scale;
    renderedHeight = image.naturalHeight * scale;
  }

  const offsetX = (rect.width - renderedWidth) * parsePositionPart(positionX);
  const offsetY = (rect.height - renderedHeight) * parsePositionPart(positionY);
  const imageX = ((x - rect.left - offsetX) / renderedWidth) * image.naturalWidth;
  const imageY = ((y - rect.top - offsetY) / renderedHeight) * image.naturalHeight;

  if (
    imageX < 0 ||
    imageX >= image.naturalWidth ||
    imageY < 0 ||
    imageY >= image.naturalHeight
  ) {
    return null;
  }

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      return null;
    }

    canvas.width = 1;
    canvas.height = 1;
    context.drawImage(image, imageX, imageY, 1, 1, 0, 0, 1, 1);
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
    return colorLuminance({ r, g, b, a: a / 255 });
  } catch {
    return null;
  }
}

function getElementVisualLuminance(element: Element, x: number, y: number) {
  if (element instanceof HTMLImageElement) {
    const imageLuminance = sampleImageLuminance(element, x, y);

    if (imageLuminance !== null) {
      return imageLuminance;
    }
  }

  const styles = getComputedStyle(element);
  const backgroundImageLuminance = averageColorLuminance(parseCssColors(styles.backgroundImage));

  if (backgroundImageLuminance !== null) {
    return backgroundImageLuminance;
  }

  const backgroundColorLuminance = averageColorLuminance(parseCssColors(styles.backgroundColor));

  if (backgroundColorLuminance !== null) {
    return backgroundColorLuminance;
  }

  return null;
}

function samplePageLuminance(x: number, y: number, header: HTMLElement) {
  const elements = document.elementsFromPoint(x, y);

  for (const element of elements) {
    if (header.contains(element)) {
      continue;
    }

    const luminance = getElementVisualLuminance(element, x, y);

    if (luminance !== null) {
      return luminance;
    }
  }

  return null;
}

export default function Header({
  content,
  language,
  onLanguageChange,
}: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const [theme, setTheme] = useState<HeaderTheme>("dark");
  const isDark = theme === "dark";
  const navItems = [
    ["#villa", content.nav.villa],
    ["#gallery", content.nav.gallery],
    ["#amenities", content.nav.amenities],
    ["#location", content.nav.location],
    ["#pricing", content.nav.pricing],
    ["#booking", content.nav.booking],
  ];

  useEffect(() => {
    let animationFrame = 0;

    function updateTheme() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const header = headerRef.current;

        if (!header) {
          return;
        }

        const headerHeight = Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
        );
        const sampleY = Number.isFinite(headerHeight) ? headerHeight / 2 : 38;
        const sampleXs = [
          28,
          window.innerWidth * 0.28,
          window.innerWidth * 0.52,
          window.innerWidth - 88,
        ].filter((value) => value > 0 && value < window.innerWidth);
        const luminanceSamples = sampleXs
          .map((sampleX) => samplePageLuminance(sampleX, sampleY, header))
          .filter((value): value is number => value !== null);

        if (luminanceSamples.length) {
          const average =
            luminanceSamples.reduce((sum, value) => sum + value, 0) / luminanceSamples.length;
          setTheme(average < 0.5 ? "dark" : "light");
          return;
        }

        const sections = Array.from(
          document.querySelectorAll<HTMLElement>("[data-header-theme]"),
        );
        const activeSection = sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= sampleY && rect.bottom > sampleY;
        });
        const nextTheme = activeSection?.dataset.headerTheme === "dark" ? "dark" : "light";

        setTheme(nextTheme);
      });
    }

    updateTheme();
    window.addEventListener("scroll", updateTheme, { passive: true });
    window.addEventListener("resize", updateTheme);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateTheme);
      window.removeEventListener("resize", updateTheme);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={[
        "fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300",
        isDark
          ? "border-ivory/18 bg-ink/28 text-ivory"
          : "border-olive/10 bg-porcelain/74 text-olive",
      ].join(" ")}
    >
      <div className="section-shell flex h-[var(--header-height)] items-center justify-between gap-4">
        <a href="#" className="group flex min-w-0 items-center gap-3" aria-label="Casa Mimosa">
          <span
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold shadow-soft transition-colors duration-300",
              isDark
                ? "border-ivory/40 bg-ivory text-olive"
                : "border-champagne/50 bg-olive text-ivory",
            ].join(" ")}
          >
            CM
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-xl text-current">Casa Mimosa</span>
            <span className="hidden text-xs text-current/62 sm:block">
              La Sierrazuela, Fuengirola / Mijas
            </span>
          </span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {navItems.map(([href, label]) => (
            <a
              className="text-sm text-current/72 transition hover:text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageToggle
            language={language}
            theme={theme}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </header>
  );
}
