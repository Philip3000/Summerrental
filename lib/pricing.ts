import { addDays } from "date-fns";
import { getNights, parseDateInput } from "@/lib/dateRanges";

export type SeasonKey = "low" | "mid" | "high" | "peak";

export type SeasonPrice = {
  key: SeasonKey;
  dkkPerDay: number;
  label: {
    da: string;
    en: string;
  };
  period: {
    da: string;
    en: string;
  };
};

export const seasonPricing: SeasonPrice[] = [
  {
    key: "low",
    dkkPerDay: 2600,
    label: { da: "Lavsæson", en: "Low season" },
    period: { da: "November til marts", en: "November to March" },
  },
  {
    key: "mid",
    dkkPerDay: 3500,
    label: { da: "Mellemsæson", en: "Mid season" },
    period: { da: "April, maj og oktober", en: "April, May and October" },
  },
  {
    key: "high",
    dkkPerDay: 4850,
    label: { da: "Højsæson", en: "High season" },
    period: { da: "Juni og september", en: "June and September" },
  },
  {
    key: "peak",
    dkkPerDay: 6000,
    label: { da: "Peaksæson", en: "Peak season" },
    period: { da: "Juli og august", en: "July and August" },
  },
];

export type PriceBreakdownLine = {
  season: SeasonKey;
  nights: number;
  dkkPerDay: number;
  subtotal: number;
};

export type StayEstimate = {
  nights: number;
  total: number;
  breakdown: PriceBreakdownLine[];
};

export function formatDkk(value: number) {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getSeasonForDate(date: Date): SeasonKey {
  const month = date.getMonth();

  if (month === 6 || month === 7) {
    return "peak";
  }

  if (month === 5 || month === 8) {
    return "high";
  }

  if (month === 3 || month === 4 || month === 9) {
    return "mid";
  }

  return "low";
}

export function getPriceForSeason(season: SeasonKey) {
  return seasonPricing.find((item) => item.key === season)?.dkkPerDay ?? 0;
}

export function calculateStayEstimate(arrivalDate: string, departureDate: string): StayEstimate {
  const arrival = parseDateInput(arrivalDate);
  const departure = parseDateInput(departureDate);

  if (!arrival || !departure) {
    return { nights: 0, total: 0, breakdown: [] };
  }

  const nights = getNights(arrivalDate, departureDate);

  if (nights <= 0) {
    return { nights: 0, total: 0, breakdown: [] };
  }

  const breakdownBySeason = new Map<SeasonKey, PriceBreakdownLine>();

  for (let nightIndex = 0; nightIndex < nights; nightIndex += 1) {
    const night = addDays(arrival, nightIndex);
    const season = getSeasonForDate(night);
    const dkkPerDay = getPriceForSeason(season);
    const current = breakdownBySeason.get(season) ?? {
      season,
      nights: 0,
      dkkPerDay,
      subtotal: 0,
    };

    current.nights += 1;
    current.subtotal += dkkPerDay;
    breakdownBySeason.set(season, current);
  }

  const breakdown = Array.from(breakdownBySeason.values());
  const total = breakdown.reduce((sum, line) => sum + line.subtotal, 0);

  return { nights, total, breakdown };
}
