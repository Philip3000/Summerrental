"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { KeyRound, X } from "lucide-react";
import type { SiteCopy } from "@/lib/i18n";

type FamilyAccessProps = {
  content: SiteCopy;
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
};

export default function FamilyAccess({ content, open, onClose, onUnlocked }: FamilyAccessProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const closeModal = useCallback(() => {
    setCode("");
    setLoading(false);
    setStatus("idle");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = window.setTimeout(() => inputRef.current?.focus(), 50);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");

    const response = await fetch("/api/validate-family-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).catch(() => null);

    const data = await response?.json().catch(() => null);
    setLoading(false);

    if (response?.ok && data?.valid) {
      setStatus("success");
      onUnlocked();
      return;
    }

    setStatus("error");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/62 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <section
        aria-labelledby="family-access-title"
        aria-modal="true"
        role="dialog"
        className="w-full max-w-md rounded-[8px] border border-ivory/50 bg-porcelain p-6 shadow-soft md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory">
              <KeyRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 id="family-access-title" className="mt-5 font-serif text-3xl text-olive">
              {content.family.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label={content.family.close}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-olive/12 text-olive transition hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-ink/68">{content.family.body}</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-olive">
              {content.family.label}
            </span>
            <input
              ref={inputRef}
              required
              type="password"
              autoComplete="off"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 text-ink outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
            />
          </label>

          {status === "success" ? (
            <p className="mt-4 rounded-[8px] bg-moss/12 px-4 py-3 text-sm font-semibold text-olive">
              {content.family.success}
            </p>
          ) : null}

          {status === "error" ? (
            <p className="mt-4 rounded-[8px] bg-clay/10 px-4 py-3 text-sm font-semibold text-clay">
              {content.family.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-olive px-6 text-sm font-bold text-ivory shadow-line transition hover:bg-dusk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne disabled:cursor-not-allowed disabled:opacity-65"
          >
            {content.family.submit}
          </button>
        </form>
      </section>
    </div>
  );
}
