"use client";

import {
  Check,
  KeyRound,
  Image as ImageIcon,
  LogOut,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import { getFirebaseClientApp } from "@/lib/firebaseClient";
import { formatDkk } from "@/lib/pricing";
import type { AccessCodeListItem } from "@/types/access";
import type { BookingAdminAction, BookingRecord, BookingStatus } from "@/types/booking";
import type { SiteContent } from "@/types/site";

type AdminDashboardProps = {
  initialAuthenticated: boolean;
  initialAccessCodes: AccessCodeListItem[];
  initialBookings: BookingRecord[];
  initialSiteContent: SiteContent;
};

type Tab = "bookings" | "codes" | "images";

const statusLabels: Record<BookingStatus, string> = {
  inquiry: "Inquiry",
  reserved: "Reserved",
  booked: "Booked",
  denied: "Denied",
  cancelled: "Cancelled",
};

const statusClasses: Record<BookingStatus, string> = {
  inquiry: "bg-sand/45 text-ink",
  reserved: "bg-champagne/25 text-olive",
  booked: "bg-moss/15 text-olive",
  denied: "bg-clay/10 text-clay",
  cancelled: "bg-stone/20 text-ink/60",
};

export default function AdminDashboard({
  initialAuthenticated,
  initialAccessCodes,
  initialBookings,
  initialSiteContent,
}: AdminDashboardProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("bookings");
  const [accessCodes, setAccessCodes] = useState(initialAccessCodes);
  const [newCodeLabel, setNewCodeLabel] = useState("");
  const [newCodeKind, setNewCodeKind] = useState<"friend" | "family">("friend");
  const [newCodeValue, setNewCodeValue] = useState("");
  const [bookings, setBookings] = useState(initialBookings);
  const [siteContent, setSiteContent] = useState(initialSiteContent);
  const [savingImages, setSavingImages] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const upcomingBookings = useMemo(
    () =>
      bookings.filter((booking) => booking.status === "reserved" || booking.status === "booked"),
    [bookings],
  );

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");

    let idToken = "";

    try {
      const auth = getAuth(getFirebaseClientApp());
      const credential = await signInWithEmailAndPassword(auth, email, password);
      idToken = await credential.user.getIdToken();
    } catch {
      setLoginError("Firebase login failed. Check email and password.");
      return;
    }

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }).catch(() => null);

    if (!response?.ok) {
      setLoginError("This Firebase user is not allowed to manage Casa Mimosa.");
      return;
    }

    setAuthenticated(true);
    setEmail("");
    setPassword("");
    await Promise.all([refreshBookings(), refreshAccessCodes()]);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    await signOut(getAuth(getFirebaseClientApp())).catch(() => undefined);
    setAuthenticated(false);
  }

  async function refreshBookings() {
    const response = await fetch("/api/admin/bookings", { cache: "no-store" });

    if (response.ok) {
      const data = (await response.json()) as { bookings: BookingRecord[] };
      setBookings(data.bookings);
    }
  }

  async function refreshAccessCodes() {
    const response = await fetch("/api/admin/access-codes", { cache: "no-store" });

    if (response.ok) {
      const data = (await response.json()) as { accessCodes: AccessCodeListItem[] };
      setAccessCodes(data.accessCodes);
    }
  }

  async function createCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    const response = await fetch("/api/admin/access-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newCodeLabel,
        kind: newCodeKind,
        code: newCodeValue,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setNotice(data?.error ?? "Code could not be created.");
      return;
    }

    const data = (await response.json()) as { accessCode: AccessCodeListItem };
    setAccessCodes((items) => [data.accessCode, ...items]);
    setNewCodeLabel("");
    setNewCodeValue("");
    setNotice("Code created. It can be used immediately.");
  }

  async function deleteCode(id: string) {
    setNotice("");

    const response = await fetch(`/api/admin/access-codes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setNotice("Code could not be deleted.");
      return;
    }

    setAccessCodes((items) => items.filter((item) => item.id !== id));
    setNotice("Code removed.");
  }

  async function updateBooking(id: string, action: BookingAdminAction) {
    setNotice("");

    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setNotice(data?.error ?? "Could not update booking.");
      return;
    }

    const data = (await response.json()) as { booking: BookingRecord };
    setBookings((items) => items.map((item) => (item.id === id ? data.booking : item)));
  }

  function updateImage(index: number, field: "src" | "altDa" | "altEn", value: string) {
    setSiteContent((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => {
        if (imageIndex !== index) {
          return image;
        }

        if (field === "src") {
          return { ...image, src: value };
        }

        return {
          ...image,
          alt: {
            ...image.alt,
            [field === "altDa" ? "da" : "en"]: value,
          },
        };
      }),
    }));
  }

  async function saveImages() {
    setSavingImages(true);
    setNotice("");

    const response = await fetch("/api/admin/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteContent),
    }).catch(() => null);

    setSavingImages(false);

    if (!response?.ok) {
      setNotice("Images could not be saved. Check that every URL is valid.");
      return;
    }

    const updated = (await response.json()) as SiteContent;
    setSiteContent(updated);
    setNotice("Images saved.");
  }

  async function uploadImage(index: number, file: File | undefined) {
    if (!file) {
      return;
    }

    setUploadingSlot(siteContent.images[index]?.slot ?? null);
    setNotice("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slot", siteContent.images[index]?.slot ?? "site-image");

    const response = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    }).catch(() => null);

    setUploadingSlot(null);

    if (!response?.ok) {
      const data = await response?.json().catch(() => null);
      setNotice(data?.error ?? "Image could not be uploaded.");
      return;
    }

    const data = (await response.json()) as { url: string };
    updateImage(index, "src", data.url);
    setNotice("Image uploaded. Remember to save images.");
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-ivory px-4 py-12 text-ink">
        <section className="mx-auto mt-20 w-full max-w-md rounded-[8px] border border-olive/10 bg-porcelain p-6 shadow-soft">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-olive text-ivory">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-serif text-4xl text-olive">Casa Mimosa Admin</h1>
          <p className="mt-3 text-sm leading-6 text-ink/62">
            Log in to manage reservations, availability and site images.
          </p>
          <form className="mt-6" onSubmit={handleLogin}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-olive">Email</span>
              <input
                required
                type="email"
                value={email}
                placeholder="owner@example.com"
                onChange={(event) => setEmail(event.target.value)}
                className="mb-3 h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-olive">Password</span>
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30"
              />
            </label>
            {loginError ? <p className="mt-3 text-sm font-semibold text-clay">{loginError}</p> : null}
            <button className="mt-6 h-12 w-full rounded-full bg-olive px-5 text-sm font-bold text-ivory transition hover:bg-dusk">
              Log in
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory text-ink">
      <header className="border-b border-olive/10 bg-porcelain">
        <div className="section-shell flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-champagne">Casa Mimosa</p>
            <h1 className="font-serif text-4xl text-olive">Admin Terminal</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void refreshBookings()}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-olive/15 px-4 text-sm font-bold text-olive"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-olive px-4 text-sm font-bold text-ivory"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="section-shell py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Active blocks" value={upcomingBookings.length.toString()} />
          <Metric
            label="Awaiting approval"
            value={bookings.filter((booking) => booking.status === "reserved").length.toString()}
          />
          <Metric
            label="Confirmed"
            value={bookings.filter((booking) => booking.status === "booked").length.toString()}
          />
        </div>

        <div className="mt-8 flex gap-2 border-b border-olive/10">
          <TabButton active={tab === "bookings"} onClick={() => setTab("bookings")}>
            Reservations
          </TabButton>
          <TabButton active={tab === "codes"} onClick={() => setTab("codes")}>
            Codes
          </TabButton>
          <TabButton active={tab === "images"} onClick={() => setTab("images")}>
            Images
          </TabButton>
        </div>

        {notice ? (
          <p className="mt-5 rounded-[8px] bg-champagne/15 px-4 py-3 text-sm font-semibold text-olive">
            {notice}
          </p>
        ) : null}

        {tab === "bookings" ? (
          <section className="mt-6 space-y-4">
            {bookings.length === 0 ? (
              <p className="rounded-[8px] bg-porcelain p-6 text-sm text-ink/62 shadow-line">
                No reservations yet.
              </p>
            ) : null}
            {bookings.map((booking) => (
              <article
                className="rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line"
                key={booking.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[booking.status]}`}
                      >
                        {statusLabels[booking.status]}
                      </span>
                      <span className="text-sm text-ink/50">{booking.reference}</span>
                    </div>
                    <h2 className="mt-4 font-serif text-3xl text-olive">{booking.name}</h2>
                    <p className="mt-2 text-sm text-ink/62">{booking.email}</p>
                    <p className="mt-3 text-sm font-semibold text-ink">
                      {booking.arrivalDate} - {booking.departureDate} · {booking.nights} nights ·{" "}
                      {booking.guests} guests
                    </p>
                    <p className="mt-2 text-sm text-ink/62">
                      {booking.bookingType.replace("_", " ")} · {formatDkk(booking.estimatedPriceDkk)}
                    </p>
                    {booking.message ? (
                      <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/68">{booking.message}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton
                      disabled={booking.status === "booked"}
                      icon={<Check className="h-4 w-4" aria-hidden="true" />}
                      label="Approve"
                      onClick={() => void updateBooking(booking.id, "approve")}
                    />
                    <ActionButton
                      disabled={booking.status === "denied" || booking.status === "cancelled"}
                      icon={<X className="h-4 w-4" aria-hidden="true" />}
                      label="Deny"
                      onClick={() => void updateBooking(booking.id, "deny")}
                    />
                    <ActionButton
                      disabled={booking.status === "cancelled"}
                      icon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
                      label="Cancel"
                      onClick={() => void updateBooking(booking.id, "cancel")}
                    />
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {tab === "codes" ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-[0.76fr_1fr]">
            <form
              onSubmit={createCode}
              className="rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 font-serif text-3xl text-olive">Create private code</h2>
              <p className="mt-2 text-sm leading-6 text-ink/62">
                Friend codes reserve dates while payment is handled directly. Family codes book dates
                immediately. Guests do not see this difference.
              </p>
              <div className="mt-5 grid gap-4">
                <InputLabel label="Name">
                  <input
                    required
                    value={newCodeLabel}
                    onChange={(event) => setNewCodeLabel(event.target.value)}
                    placeholder="Summer friends 2026"
                    className="h-11 w-full rounded-[8px] border border-olive/14 bg-ivory px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                  />
                </InputLabel>
                <InputLabel label="Type">
                  <select
                    value={newCodeKind}
                    onChange={(event) => setNewCodeKind(event.target.value as "friend" | "family")}
                    className="h-11 w-full rounded-[8px] border border-olive/14 bg-ivory px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                  >
                    <option value="friend">Friend code</option>
                    <option value="family">Family code</option>
                  </select>
                </InputLabel>
                <InputLabel label="Code">
                  <input
                    required
                    value={newCodeValue}
                    onChange={(event) => setNewCodeValue(event.target.value)}
                    placeholder="Choose a private code"
                    className="h-11 w-full rounded-[8px] border border-olive/14 bg-ivory px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                  />
                </InputLabel>
              </div>
              <button className="mt-6 h-11 rounded-full bg-olive px-5 text-sm font-bold text-ivory">
                Create code
              </button>
            </form>

            <div className="rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line">
              <h2 className="font-serif text-3xl text-olive">Active codes</h2>
              <div className="mt-5 space-y-3">
                {accessCodes.length === 0 ? (
                  <p className="rounded-[8px] bg-ivory p-4 text-sm text-ink/62">
                    No codes yet.
                  </p>
                ) : null}
                {accessCodes.map((accessCode) => (
                  <div
                    key={accessCode.id}
                    className="flex flex-col gap-3 rounded-[8px] border border-olive/10 bg-ivory p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-olive">{accessCode.label}</p>
                      <p className="mt-1 text-sm text-ink/58">
                        {accessCode.kind === "family" ? "Family" : "Friend"} ·{" "}
                        {accessCode.codePreview}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void deleteCode(accessCode.id)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-clay/25 px-4 text-sm font-bold text-clay"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {tab === "images" ? (
          <section className="mt-6 rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-serif text-3xl text-olive">Site Images</h2>
                <p className="mt-2 text-sm text-ink/62">
                  Paste image URLs here. Unsplash URLs work, and real villa photos can be added later.
                </p>
              </div>
              <button
                type="button"
                disabled={savingImages}
                onClick={() => void saveImages()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-olive px-5 text-sm font-bold text-ivory disabled:opacity-60"
              >
                <ImageIcon className="h-4 w-4" aria-hidden="true" />
                Save images
              </button>
            </div>
            <div className="mt-6 grid gap-5">
              {siteContent.images.map((image, index) => (
                <div className="rounded-[8px] border border-olive/10 bg-ivory p-4" key={image.slot}>
                  <p className="font-semibold text-olive">{image.label}</p>
                  <div className="mt-4 grid gap-4 lg:grid-cols-[160px_1fr]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt={image.alt.en}
                      className="h-28 w-full rounded-[8px] object-cover"
                    />
                    <div className="grid gap-3">
                      <InputLabel label="Image URL">
                        <input
                          value={image.src}
                          onChange={(event) => updateImage(index, "src", event.target.value)}
                          className="h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                        />
                      </InputLabel>
                      <InputLabel label="Upload from computer">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingSlot === image.slot}
                          onChange={(event) =>
                            void uploadImage(index, event.target.files?.[0])
                          }
                          className="block w-full text-sm text-ink/62 file:mr-4 file:h-10 file:rounded-full file:border-0 file:bg-olive file:px-4 file:text-sm file:font-bold file:text-ivory"
                        />
                      </InputLabel>
                      <div className="grid gap-3 md:grid-cols-2">
                        <InputLabel label="Alt text Danish">
                          <input
                            value={image.alt.da}
                            onChange={(event) => updateImage(index, "altDa", event.target.value)}
                            className="h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                          />
                        </InputLabel>
                        <InputLabel label="Alt text English">
                          <input
                            value={image.alt.en}
                            onChange={(event) => updateImage(index, "altEn", event.target.value)}
                            className="h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30"
                          />
                        </InputLabel>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line">
      <p className="text-sm text-ink/55">{label}</p>
      <p className="mt-2 font-serif text-4xl text-olive">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-3 text-sm font-bold ${
        active ? "border-champagne text-olive" : "border-transparent text-ink/52"
      }`}
    >
      {children}
    </button>
  );
}

function ActionButton({
  disabled,
  icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-olive/15 px-4 text-sm font-bold text-olive transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-45"
    >
      {icon}
      {label}
    </button>
  );
}

function InputLabel({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-ink/48">{label}</span>
      {children}
    </label>
  );
}
