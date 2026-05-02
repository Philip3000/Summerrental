import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseServerDb } from "@/lib/firebaseServer";
import { rangesOverlap } from "@/lib/dateRanges";
import { mergeSiteContent } from "@/lib/siteContent";
import type { BookingAdminAction, BookingRecord, BookingStatus } from "@/types/booking";
import type { SiteContent } from "@/types/site";

type BookingCreateInput = Omit<BookingRecord, "id">;

type CalendarPeriod = {
  bookingId: string;
  arrivalDate: string;
  departureDate: string;
  status: Extract<BookingStatus, "reserved" | "booked">;
};

const BOOKINGS_COLLECTION = "bookings";
const CALENDAR_COLLECTION = "calendar";
const CALENDAR_DOCUMENT = "availability";
const SITE_CONTENT_COLLECTION = "siteContent";
const SITE_CONTENT_DOCUMENT = "main";

const globalStore = globalThis as typeof globalThis & {
  __casaMimosaBookings?: BookingRecord[];
  __casaMimosaSiteContent?: SiteContent;
};

function getMemoryBookings() {
  globalStore.__casaMimosaBookings ??= [];
  return globalStore.__casaMimosaBookings;
}

function isBlockingStatus(status: BookingStatus): status is Extract<BookingStatus, "reserved" | "booked"> {
  return status === "reserved" || status === "booked";
}

function calendarPeriodOverlaps(
  period: Pick<CalendarPeriod, "arrivalDate" | "departureDate">,
  arrivalDate: string,
  departureDate: string,
) {
  return rangesOverlap(period.arrivalDate, period.departureDate, arrivalDate, departureDate);
}

function bookingOverlaps(
  booking: Pick<BookingRecord, "arrivalDate" | "departureDate" | "status">,
  arrivalDate: string,
  departureDate: string,
) {
  return (
    isBlockingStatus(booking.status) &&
    rangesOverlap(booking.arrivalDate, booking.departureDate, arrivalDate, departureDate)
  );
}

function normalizeBooking(id: string, data: DocumentData): BookingRecord {
  return {
    id,
    reference: data.reference,
    language: data.language,
    name: data.name,
    email: data.email,
    arrivalDate: data.arrivalDate,
    departureDate: data.departureDate,
    guests: data.guests,
    message: data.message ?? "",
    estimatedPriceDkk: data.estimatedPriceDkk ?? data.estimatedPrice ?? 0,
    privateAccessKind: data.privateAccessKind ?? "none",
    requiresApproval: Boolean(data.requiresApproval),
    bookingType: data.bookingType,
    status: data.status,
    nights: data.nights ?? 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    decidedAt: data.decidedAt,
    adminNote: data.adminNote,
  };
}

function getCalendarPeriods(data: DocumentData | undefined): CalendarPeriod[] {
  return Array.isArray(data?.periods) ? data.periods : [];
}

export async function listBookings() {
  const db = await getFirebaseServerDb();

  if (!db) {
    return [...getMemoryBookings()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const snapshot = await getDocs(query(collection(db, BOOKINGS_COLLECTION), orderBy("createdAt", "desc")));

  return snapshot.docs.map((bookingDoc) => normalizeBooking(bookingDoc.id, bookingDoc.data()));
}

export async function listBlockingBookings() {
  const bookings = await listBookings();
  return bookings.filter((booking) => isBlockingStatus(booking.status));
}

export async function createBooking(input: BookingCreateInput) {
  const db = await getFirebaseServerDb();
  const blockingStatus = input.status;

  if (!db) {
    const existingOverlap = getMemoryBookings().some((booking) =>
      bookingOverlaps(booking, input.arrivalDate, input.departureDate),
    );

    if (isBlockingStatus(input.status) && existingOverlap) {
      throw new Error("DATES_NOT_AVAILABLE");
    }

    const booking = { id: `local-${Date.now().toString(36)}`, ...input };
    getMemoryBookings().push(booking);
    return booking;
  }

  if (!isBlockingStatus(input.status)) {
    const bookingRef = doc(collection(db, BOOKINGS_COLLECTION));
    await setDoc(bookingRef, {
      ...input,
      serverCreatedAt: serverTimestamp(),
      serverUpdatedAt: serverTimestamp(),
    });
    return { id: bookingRef.id, ...input };
  }

  if (!isBlockingStatus(blockingStatus)) {
    throw new Error("NON_BLOCKING_STATUS");
  }

  return runTransaction(db, async (transaction) => {
    const bookingRef = doc(collection(db, BOOKINGS_COLLECTION));
    const calendarRef = doc(db, CALENDAR_COLLECTION, CALENDAR_DOCUMENT);
    const calendarSnapshot = await transaction.get(calendarRef);
    const periods = getCalendarPeriods(calendarSnapshot.data());
    const hasOverlap = periods.some((period) =>
      calendarPeriodOverlaps(period, input.arrivalDate, input.departureDate),
    );

    if (hasOverlap) {
      throw new Error("DATES_NOT_AVAILABLE");
    }

    const nextPeriods: CalendarPeriod[] = [
      ...periods,
      {
        bookingId: bookingRef.id,
        arrivalDate: input.arrivalDate,
        departureDate: input.departureDate,
        status: blockingStatus,
      },
    ];

    transaction.set(bookingRef, {
      ...input,
      serverCreatedAt: serverTimestamp(),
      serverUpdatedAt: serverTimestamp(),
    });
    transaction.set(
      calendarRef,
      {
        periods: nextPeriods,
        updatedAt: new Date().toISOString(),
        serverUpdatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return {
      id: bookingRef.id,
      ...input,
    };
  });
}

export async function updateBookingStatus(id: string, action: BookingAdminAction, adminNote?: string) {
  const now = new Date().toISOString();
  const statusByAction: Record<BookingAdminAction, BookingStatus> = {
    approve: "booked",
    deny: "denied",
    cancel: "cancelled",
  };
  const nextStatus = statusByAction[action];
  const db = await getFirebaseServerDb();

  if (!db) {
    const bookings = getMemoryBookings();
    const booking = bookings.find((item) => item.id === id);

    if (!booking) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    if (nextStatus === "booked") {
      const available = !bookings.some(
        (item) =>
          item.id !== id &&
          bookingOverlaps(item, booking.arrivalDate, booking.departureDate),
      );

      if (!available) {
        throw new Error("DATES_NOT_AVAILABLE");
      }
    }

    booking.status = nextStatus;
    booking.updatedAt = now;
    booking.decidedAt = now;
    booking.adminNote = adminNote;
    booking.requiresApproval = false;
    return booking;
  }

  return runTransaction(db, async (transaction) => {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
    const calendarRef = doc(db, CALENDAR_COLLECTION, CALENDAR_DOCUMENT);
    const bookingSnapshot = await transaction.get(bookingRef);

    if (!bookingSnapshot.exists()) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    const booking = normalizeBooking(bookingSnapshot.id, bookingSnapshot.data());
    const calendarSnapshot = await transaction.get(calendarRef);
    const currentPeriods = getCalendarPeriods(calendarSnapshot.data()).filter(
      (period) => period.bookingId !== id,
    );

    let nextPeriods = currentPeriods;

    if (isBlockingStatus(nextStatus)) {
      const hasOverlap = currentPeriods.some((period) =>
        calendarPeriodOverlaps(period, booking.arrivalDate, booking.departureDate),
      );

      if (hasOverlap) {
        throw new Error("DATES_NOT_AVAILABLE");
      }

      nextPeriods = [
        ...currentPeriods,
        {
          bookingId: id,
          arrivalDate: booking.arrivalDate,
          departureDate: booking.departureDate,
          status: nextStatus,
        },
      ];
    }

    transaction.update(bookingRef, {
      status: nextStatus,
      requiresApproval: false,
      updatedAt: now,
      decidedAt: now,
      adminNote: adminNote ?? "",
      serverUpdatedAt: serverTimestamp(),
    });
    transaction.set(
      calendarRef,
      {
        periods: nextPeriods,
        updatedAt: now,
        serverUpdatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return {
      ...booking,
      status: nextStatus,
      requiresApproval: false,
      updatedAt: now,
      decidedAt: now,
      adminNote,
    };
  });
}

export async function getSiteContent() {
  const db = await getFirebaseServerDb();

  if (!db) {
    return mergeSiteContent(globalStore.__casaMimosaSiteContent);
  }

  const siteContentDoc = await getDoc(doc(db, SITE_CONTENT_COLLECTION, SITE_CONTENT_DOCUMENT));
  return mergeSiteContent(siteContentDoc.exists() ? (siteContentDoc.data() as Partial<SiteContent>) : null);
}

export async function updateSiteContent(content: Partial<SiteContent>) {
  const merged = mergeSiteContent(content);
  const updated = {
    ...merged,
    updatedAt: new Date().toISOString(),
  };
  const db = await getFirebaseServerDb();

  if (!db) {
    globalStore.__casaMimosaSiteContent = updated;
    return updated;
  }

  await setDoc(
    doc(db, SITE_CONTENT_COLLECTION, SITE_CONTENT_DOCUMENT),
    { ...updated, serverUpdatedAt: serverTimestamp() },
    { merge: true },
  );

  return updated;
}
