import { addDays, differenceInCalendarDays, format, isValid, parseISO } from "date-fns";

export function parseDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = parseISO(`${value}T00:00:00`);
  return isValid(date) ? date : null;
}

export function getNights(arrivalDate: string, departureDate: string) {
  const arrival = parseDateInput(arrivalDate);
  const departure = parseDateInput(departureDate);

  if (!arrival || !departure) {
    return 0;
  }

  return Math.max(0, differenceInCalendarDays(departure, arrival));
}

export function rangesOverlap(
  firstArrival: string,
  firstDeparture: string,
  secondArrival: string,
  secondDeparture: string,
) {
  return firstArrival < secondDeparture && secondArrival < firstDeparture;
}

export function eachNight(arrivalDate: string, departureDate: string) {
  const arrival = parseDateInput(arrivalDate);
  const nights = getNights(arrivalDate, departureDate);

  if (!arrival || nights <= 0) {
    return [];
  }

  return Array.from({ length: nights }, (_, index) => format(addDays(arrival, index), "yyyy-MM-dd"));
}

export function addDaysToInput(value: string, days: number) {
  const date = parseDateInput(value);
  return date ? format(addDays(date, days), "yyyy-MM-dd") : "";
}
