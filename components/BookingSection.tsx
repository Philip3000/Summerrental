"use client";

import { addDays, format, parseISO } from "date-fns";
import { CalendarDays, CheckCircle2, Euro, Send, UsersRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { Language, SiteCopy } from "@/lib/i18n";
import { calculateStayEstimate, seasonPricing } from "@/lib/pricing";

type BookingSectionProps = {
  content: SiteCopy;
  language: Language;
  familyAccessUnlocked: boolean;
};

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string };

const today = format(new Date(), "yyyy-MM-dd");

export default function BookingSection({
  content,
  language,
  familyAccessUnlocked,
}: BookingSectionProps) {
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const estimate = useMemo(
    () => calculateStayEstimate(arrivalDate, departureDate),
    [arrivalDate, departureDate],
  );
  const estimatedPrice = familyAccessUnlocked ? 0 : estimate.total;
  const hasDateError = Boolean(arrivalDate && departureDate && estimate.nights === 0);
  const departureMin = arrivalDate
    ? format(addDays(parseISO(`${arrivalDate}T00:00:00`), 1), "yyyy-MM-dd")
    : today;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (estimate.nights <= 0) {
      setSubmitState({ status: "error", message: content.booking.rangeError });
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
        estimatedPrice,
        familyAccessUnlocked,
        bookingType: familyAccessUnlocked ? "family_reservation" : "public_request",
      }),
    }).catch(() => null);

    if (!response?.ok) {
      const data = await response?.json().catch(() => null);
      setSubmitState({
        status: "error",
        message: data?.error ?? content.booking.error,
      });
      return;
    }

    const data = (await response.json()) as { reference: string };
    setSubmitState({ status: "success", reference: data.reference });
  }

  return (
    <section id="booking" className="bg-ivory py-20 md:py-28">
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
              <Euro className="h-5 w-5 text-champagne" aria-hidden="true" />
              <p className="text-sm font-semibold text-olive">{content.booking.estimate}</p>
            </div>
            <p className="mt-5 font-serif text-5xl text-olive">
              {familyAccessUnlocked ? "EUR 0" : `EUR ${estimatedPrice.toLocaleString("da-DK")}`}
            </p>
            <p className="mt-2 text-sm text-ink/60">
              {estimate.nights > 0
                ? `${estimate.nights} ${
                    estimate.nights === 1 ? content.booking.night : content.booking.nights
                  }`
                : content.booking.guide}
            </p>
            {familyAccessUnlocked ? (
              <p className="mt-4 rounded-[8px] bg-moss/12 px-4 py-3 text-sm font-semibold text-olive">
                {content.booking.familyUnlocked}
              </p>
            ) : null}
            {estimate.breakdown.length > 0 && !familyAccessUnlocked ? (
              <div className="mt-5 space-y-2 border-t border-olive/10 pt-4">
                {estimate.breakdown.map((line) => {
                  const season = seasonPricing.find((item) => item.key === line.season);

                  return (
                    <div className="flex justify-between gap-4 text-sm text-ink/62" key={line.season}>
                      <span>
                        {season?.label[language]} x {line.nights}
                      </span>
                      <span>EUR {line.subtotal.toLocaleString("da-DK")}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-soft md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-olive">
                <CalendarDays className="h-4 w-4 text-champagne" aria-hidden="true" />
                {content.booking.arrival}
              </span>
              <input
                required
                type="date"
                min={today}
                value={arrivalDate}
                onChange={(event) => setArrivalDate(event.target.value)}
                className="h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 text-ink outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-olive">
                <CalendarDays className="h-4 w-4 text-champagne" aria-hidden="true" />
                {content.booking.departure}
              </span>
              <input
                required
                type="date"
                min={departureMin}
                value={departureDate}
                onChange={(event) => setDepartureDate(event.target.value)}
                className="h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 text-ink outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
              />
            </label>

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
                    {content.booking.successBody} Reference: {submitState.reference}
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
            {familyAccessUnlocked ? content.booking.reserve : content.booking.request}
          </button>
        </form>
      </div>
    </section>
  );
}
