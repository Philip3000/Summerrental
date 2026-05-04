"use client";

import { Banknote, CheckCircle2, Eye, EyeOff, KeyRound, Send, UsersRound } from "lucide-react";
import { type CSSProperties, type FormEvent, useEffect, useMemo, useState } from "react";
import BookingCalendar from "@/components/BookingCalendar";
import { rangesOverlap } from "@/lib/dateRanges";
import type { Language, SiteCopy } from "@/lib/i18n";
import { calculateStayEstimate, formatDkk } from "@/lib/pricing";
import type { SeasonPrice } from "@/lib/pricing";
import type { BookingStatus, PublicAvailabilityPeriod } from "@/types/booking";

type BookingSectionProps = {
  content: SiteCopy;
  language: Language;
  pricing: SeasonPrice[];
  today: string;
};

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; reference: string; bookingStatus: BookingStatus }
  | { status: "error"; message: string };

export default function BookingSection({
  content,
  language,
  pricing,
  today,
}: BookingSectionProps) {
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [privateCode, setPrivateCode] = useState("");
  const [showPrivateCode, setShowPrivateCode] = useState(false);
  const [message, setMessage] = useState("");
  const [reservedPeriods, setReservedPeriods] = useState<PublicAvailabilityPeriod[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const estimate = useMemo(
    () => calculateStayEstimate(arrivalDate, departureDate, pricing),
    [arrivalDate, departureDate, pricing],
  );
  const estimatedPrice = estimate.total;
  const hasDateError = Boolean(arrivalDate && departureDate && estimate.nights === 0);
  const selectedDatesBlocked = reservedPeriods.some((period) =>
    rangesOverlap(arrivalDate, departureDate, period.arrivalDate, period.departureDate),
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      const response = await fetch("/api/availability", { cache: "no-store" }).catch(() => null);
      const data = (await response?.json().catch(() => null)) as
        | { periods?: PublicAvailabilityPeriod[] }
        | null;

      if (!cancelled && data?.periods) {
        setReservedPeriods(data.periods);
      }
    }

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (estimate.nights <= 0) {
      setSubmitState({ status: "error", message: content.booking.rangeError });
      return;
    }

    if (selectedDatesBlocked) {
      setSubmitState({ status: "error", message: content.booking.unavailableError });
      return;
    }

    setSubmitState({ status: "loading" });

    const response = await fetch("/api/booking-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        name,
        email,
        arrivalDate,
        departureDate,
        guests,
        message,
        privateCode,
      }),
    }).catch(() => null);

    if (!response?.ok) {
      const data = await response?.json().catch(() => null);
      setSubmitState({
        status: "error",
        message:
          data?.code === "DATES_NOT_AVAILABLE"
            ? content.booking.unavailableError
            : data?.code === "INVALID_PRIVATE_CODE"
            ? content.booking.privateCodeError
            : data?.error ?? content.booking.error,
      });
      return;
    }

    const data = (await response.json()) as { reference: string; status: BookingStatus };
    setSubmitState({ status: "success", reference: data.reference, bookingStatus: data.status });

    if (data.status === "reserved" || data.status === "booked") {
      const blockingStatus: PublicAvailabilityPeriod["status"] = data.status;
      setReservedPeriods((periods) => [
        ...periods,
        { arrivalDate, departureDate, status: blockingStatus },
      ]);
    }
  }

  return (
    <section id="booking" data-header-theme="light" className="bg-ivory py-20 md:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-sm font-semibold uppercase text-champagne">
            {content.booking.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-olive text-balance md:text-6xl">
            {content.booking.title}
          </h2>
          <p className="mt-7 text-lg leading-8 text-ink/70">{content.booking.body}</p>

          <div className="mt-9 rounded-[8px] border border-olive/10 bg-porcelain p-6 shadow-line">
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-champagne" aria-hidden="true" />
              <p className="text-sm font-semibold text-olive">{content.booking.estimate}</p>
            </div>
            <p className="mt-5 font-serif text-5xl text-olive">
              {formatDkk(estimatedPrice)}
            </p>
            <p className="mt-2 text-sm text-ink/60">
              {estimate.nights > 0
                ? `${estimate.nights} ${
                    estimate.nights === 1 ? content.booking.night : content.booking.nights
                  }`
                : content.booking.guide}
            </p>
            {estimate.breakdown.length > 0 ? (
              <div className="mt-5 space-y-2 border-t border-olive/10 pt-4">
                {estimate.breakdown.map((line) => {
                  const season = pricing.find((item) => item.key === line.season);

                  return (
                    <div className="flex justify-between gap-4 text-sm text-ink/62" key={line.season}>
                      <span>
                        {season?.label[language]} x {line.nights}
                      </span>
                      <span>{formatDkk(line.subtotal)}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {arrivalDate && departureDate && estimate.nights > 0 ? (
              <p
                className={[
                  "mt-5 rounded-[8px] px-4 py-3 text-sm font-semibold",
                  selectedDatesBlocked ? "bg-clay/10 text-clay" : "bg-moss/12 text-olive",
                ].join(" ")}
              >
                {selectedDatesBlocked
                  ? content.booking.unavailableStatus
                  : content.booking.availableStatus}
              </p>
            ) : null}
            {reservedPeriods.length > 0 ? (
              <div className="mt-6 border-t border-olive/10 pt-4">
                <p className="text-sm font-semibold text-olive">{content.booking.calendarTitle}</p>
                <div className="mt-3 space-y-2">
                  {reservedPeriods.slice(0, 5).map((period) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-[8px] bg-ivory px-3 py-2 text-xs text-ink/62"
                      key={`${period.arrivalDate}-${period.departureDate}-${period.status}`}
                    >
                      <span>
                        {period.arrivalDate} - {period.departureDate}
                      </span>
                      <span className="font-semibold text-olive">
                        {period.status === "booked"
                          ? content.booking.bookedLabel
                          : content.booking.reservedLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-soft md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <BookingCalendar
                arrivalDate={arrivalDate}
                content={content}
                departureDate={departureDate}
                language={language}
                periods={reservedPeriods}
                today={today}
                onRangeChange={(nextArrivalDate, nextDepartureDate) => {
                  setArrivalDate(nextArrivalDate);
                  setDepartureDate(nextDepartureDate);
                }}
              />
            </div>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-olive">
                <UsersRound className="h-4 w-4 text-champagne" aria-hidden="true" />
                {content.booking.guests}
              </span>
              <input
                required
                type="number"
                min={1}
                max={8}
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                className="h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 text-ink outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-olive">
                {content.booking.name}
              </span>
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 text-ink outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-olive">
                {content.booking.email}
              </span>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 text-ink outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-olive">
                <KeyRound className="h-4 w-4 text-champagne" aria-hidden="true" />
                {content.booking.privateCode}
              </span>
              <span className="relative block">
                <input
                  type="text"
                  name="booking-code"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-1p-ignore="true"
                  data-bwignore="true"
                  data-lpignore="true"
                  value={privateCode}
                  onChange={(event) => setPrivateCode(event.target.value)}
                  placeholder={content.booking.privateCodePlaceholder}
                  className="h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 pr-12 text-ink outline-none transition placeholder:text-ink/38 focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                  style={{
                    WebkitTextSecurity: showPrivateCode || !privateCode ? "none" : "disc",
                  } as CSSProperties & { WebkitTextSecurity?: string }}
                />
                <button
                  type="button"
                  aria-label={
                    showPrivateCode
                      ? content.booking.hidePrivateCode
                      : content.booking.showPrivateCode
                  }
                  aria-pressed={showPrivateCode}
                  onClick={() => setShowPrivateCode((current) => !current)}
                  className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-olive/66 transition hover:bg-olive/8 hover:text-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                >
                  {showPrivateCode ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-olive">
                {content.booking.message}
              </span>
              <textarea
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={content.booking.messagePlaceholder}
                className="w-full resize-none rounded-[8px] border border-olive/14 bg-ivory px-4 py-3 text-ink outline-none transition placeholder:text-ink/38 focus:border-champagne focus:ring-2 focus:ring-champagne/30"
              />
            </label>
          </div>

          {hasDateError ? (
            <p className="mt-4 text-sm font-semibold text-clay" role="alert">
              {content.booking.rangeError}
            </p>
          ) : null}

          {!hasDateError && selectedDatesBlocked ? (
            <p className="mt-4 text-sm font-semibold text-clay" role="alert">
              {content.booking.unavailableError}
            </p>
          ) : null}

          {submitState.status === "success" ? (
            <div
              className="mt-6 rounded-[8px] border border-moss/20 bg-moss/10 p-4 text-olive"
              role="status"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{content.booking.successTitle}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/68">
                    {submitState.bookingStatus === "inquiry"
                      ? content.booking.successBody
                      : content.booking.reservedBody}{" "}
                    Reference: {submitState.reference}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {submitState.status === "error" ? (
            <p className="mt-4 text-sm font-semibold text-clay" role="alert">
              {submitState.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitState.status === "loading"}
            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-olive px-6 text-sm font-bold text-ivory shadow-line transition hover:bg-dusk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne disabled:cursor-not-allowed disabled:opacity-65 md:w-auto"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {content.booking.request}
          </button>
        </form>
      </div>
    </section>
  );
}
