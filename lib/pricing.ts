import { addDays, differenceInCalendarDays, isValid, parseISO } from "date-fns";

export type SeasonKey = "low" | "mid" | "high" | "peak";

export type SeasonPrice = {
  key: SeasonKey;
  eurPerDay: number;
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
    eurPerDay: 350,
    label: { da: "Lavsæson", en: "Low season" },
    period: { da: "November til marts", en: "November to March" },
  },
  {
    key: "mid",
    eurPerDay: 475,
    label: { da: "Mellemsæson", en: "Mid season" },
    period: { da: "April, maj og oktober", en: "April, May and October" },
  },
  {
    key: "high",
    eurPerDay: 650,
    label: { da: "Højsæson", en: "High season" },
    period: { da: "Juni og september", en: "June and September" },
  },
  {
    key: "peak",
    eurPerDay: 800,
    label: { da: "Peaksæson", en: "Peak season" },
    period: { da: "Juli og august", en: "July and August" },
  },
];

export type PriceBreakdownLine = {
  season: SeasonKey;
  nights: number;
  eurPerDay: number;
  subtotal: number;
};

export type StayEstimate = {
  nights: number;
  total: number;
  breakdown: PriceBreakdownLine[];
};

export function parseDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = parseISO(`${value}T00:00:00`);
  return isValid(date) ? date : null;
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
  return seasonPricing.find((item) => item.key === season)?.eurPerDay ?? 0;
}

export function calculateStayEstimate(arrivalDate: string, departureDate: string): StayEstimate {
  const arrival = parseDateInput(arrivalDate);
  const departure = parseDateInput(departureDate);

  if (!arrival || !departure) {
    return { nights: 0, total: 0, breakdown: [] };
  }

  const nights = differenceInCalendarDays(departure, arrival);

  if (nights <= 0) {
    return { nights: 0, total: 0, breakdown: [] };
  }

  const breakdownBySeason = new Map<SeasonKey, PriceBreakdownLine>();

  for (let nightIndex = 0; nightIndex < nights; nightIndex += 1) {
    const night = addDays(arrival, nightIndex);
    const season = getSeasonForDate(night);
    const eurPerDay = getPriceForSeason(season);
    const current = breakdownBySeason.get(season) ?? {
      season,
      nights: 0,
      eurPerDay,
      subtotal: 0,
    };

    current.nights += 1;
    current.subtotal += eurPerDay;
    breakdownBySeason.set(season, current);
  }

  const breakdown = Array.from(breakdownBySeason.values());
  const total = breakdown.reduce((sum, line) => sum + line.subtotal, 0);

  return { nights, total, breakdown };
}
