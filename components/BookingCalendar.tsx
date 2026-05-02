"use client";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { eachNight, parseDateInput } from "@/lib/dateRanges";
import type { Language, SiteCopy } from "@/lib/i18n";
import type { PublicAvailabilityPeriod } from "@/types/booking";

type BookingCalendarProps = {
  arrivalDate: string;
  content: SiteCopy;
  departureDate: string;
  language: Language;
  periods: PublicAvailabilityPeriod[];
  today: string;
  onRangeChange: (arrivalDate: string, departureDate: string) => void;
};

type DayStatus = "available" | "reserved" | "booked";

const weekdays = {
  da: ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export default function BookingCalendar({
  arrivalDate,
  content,
  departureDate,
  language,
  periods,
  today,
  onRangeChange,
}: BookingCalendarProps) {
  const todayDate = parseDateInput(today) ?? new Date();
  const [year, month] = today.split("-").map(Number);
  const fallbackMonth = new Date(year, month - 1, 1);
  const visibleStart = parseDateInput(`${year}-${String(month).padStart(2, "0")}-01`) ?? fallbackMonth;
  const selectedNights = arrivalDate && departureDate ? eachNight(arrivalDate, departureDate) : [];
  const selectedStart = parseDateInput(arrivalDate);
  const selectedEndNight = departureDate ? addDays(parseDateInput(departureDate) ?? todayDate, -1) : null;

  const [cursor, setCursor] = useState(visibleStart);
  const months = [cursor, addMonths(cursor, 1)];

  function getDayStatus(dayString: string): DayStatus {
    const booking = periods.find((period) =>
      eachNight(period.arrivalDate, period.departureDate).includes(dayString),
    );

    if (booking?.status === "booked") {
      return "booked";
    }

    if (booking?.status === "reserved") {
      return "reserved";
    }

    return "available";
  }

  function handleDayClick(day: Date) {
    const dayString = format(day, "yyyy-MM-dd");
    const status = getDayStatus(dayString);
    const isPast = isBefore(day, todayDate) && !isSameDay(day, todayDate);

    if (status !== "available" || isPast) {
      return;
    }

    if (!arrivalDate || (arrivalDate && departureDate)) {
      onRangeChange(dayString, "");
      return;
    }

    const start = parseDateInput(arrivalDate);

    if (!start || !isBefore(start, day)) {
      onRangeChange(dayString, "");
      return;
    }

    onRangeChange(arrivalDate, format(addDays(day, 1), "yyyy-MM-dd"));
  }

  return (
    <div className="rounded-[8px] border border-olive/10 bg-ivory p-4 shadow-line md:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-olive">{content.booking.periodLabel}</p>
          <p className="mt-1 text-xs text-ink/55">
            {arrivalDate && departureDate && selectedEndNight
              ? `${formatDate(arrivalDate, language)} - ${formatDate(
                  format(selectedEndNight, "yyyy-MM-dd"),
                  language,
                )}`
              : content.booking.periodHelp}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={content.booking.previousMonth}
            onClick={() => setCursor(addMonths(cursor, -1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-olive/12 text-olive transition hover:bg-porcelain focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={content.booking.nextMonth}
            onClick={() => setCursor(addMonths(cursor, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-olive/12 text-olive transition hover:bg-porcelain focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onRangeChange("", "")}
            className="flex h-10 items-center gap-2 rounded-full border border-olive/12 px-3 text-xs font-bold text-olive transition hover:bg-porcelain focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            {content.booking.clearPeriod}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {months.map((monthDate) => (
          <MonthGrid
            key={format(monthDate, "yyyy-MM")}
            arrivalDate={arrivalDate}
            departureDate={departureDate}
            language={language}
            monthDate={monthDate}
            selectedEndNight={selectedEndNight}
            selectedNights={selectedNights}
            selectedStart={selectedStart}
            todayDate={todayDate}
            weekdays={weekdays[language]}
            getDayStatus={getDayStatus}
            onDayClick={handleDayClick}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-ink/62">
        <LegendDot className="bg-porcelain shadow-line" label={content.booking.availableLegend} />
        <LegendDot className="bg-champagne/35" label={content.booking.reservedLabel} />
        <LegendDot className="bg-olive text-ivory" label={content.booking.bookedLabel} />
        <LegendDot className="bg-moss/20 ring-2 ring-moss" label={content.booking.selectedLegend} />
      </div>
    </div>
  );
}

function MonthGrid({
  arrivalDate,
  departureDate,
  getDayStatus,
  language,
  monthDate,
  onDayClick,
  selectedEndNight,
  selectedNights,
  selectedStart,
  todayDate,
  weekdays,
}: {
  arrivalDate: string;
  departureDate: string;
  getDayStatus: (day: string) => DayStatus;
  language: Language;
  monthDate: Date;
  onDayClick: (day: Date) => void;
  selectedEndNight: Date | null;
  selectedNights: string[];
  selectedStart: Date | null;
  todayDate: Date;
  weekdays: string[];
}) {
  const monthStart = startOfMonth(monthDate);
  const gridDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 }),
  });

  return (
    <div>
      <p className="font-serif text-2xl text-olive">
        {new Intl.DateTimeFormat(language === "da" ? "da-DK" : "en-US", {
          month: "long",
          year: "numeric",
        }).format(monthStart)}
      </p>
      <div className="mt-4 grid grid-cols-7 gap-1">
        {weekdays.map((weekday) => (
          <div className="h-8 text-center text-xs font-bold uppercase text-ink/42" key={weekday}>
            {weekday}
          </div>
        ))}
        {gridDays.map((day) => {
          const dayString = format(day, "yyyy-MM-dd");
          const status = getDayStatus(dayString);
          const isOutsideMonth = day.getMonth() !== monthStart.getMonth();
          const isPast = isBefore(day, todayDate) && !isSameDay(day, todayDate);
          const isSelected = selectedNights.includes(dayString);
          const isStart = selectedStart ? isSameDay(day, selectedStart) : false;
          const isEnd = selectedEndNight ? isSameDay(day, selectedEndNight) : false;
          const disabled = status !== "available" || isPast;

          return (
            <button
              type="button"
              key={dayString}
              disabled={disabled}
              onClick={() => onDayClick(day)}
              className={[
                "relative flex aspect-square min-h-10 items-center justify-center rounded-[8px] text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
                isOutsideMonth ? "opacity-35" : "",
                isPast ? "cursor-not-allowed text-ink/24" : "",
                !disabled && !isSelected ? "bg-porcelain text-olive shadow-line hover:bg-champagne/18" : "",
                status === "reserved" ? "cursor-not-allowed bg-champagne/35 text-olive" : "",
                status === "booked" ? "cursor-not-allowed bg-olive text-ivory" : "",
                isSelected ? "bg-moss/20 text-olive ring-2 ring-moss" : "",
                isStart || isEnd ? "bg-moss text-ivory ring-2 ring-moss" : "",
                arrivalDate && !departureDate && isStart ? "animate-pulse" : "",
              ].join(" ")}
              aria-label={`${dayString} ${status}`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-[4px] ${className}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function formatDate(value: string, language: Language) {
  const date = parseDateInput(value);
  return date
    ? new Intl.DateTimeFormat(language === "da" ? "da-DK" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date)
    : value;
}
