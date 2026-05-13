'use client'

import {
  Check,
  FileText,
  Image as ImageIcon,
  KeyRound,
  LogOut,
  Plus,
  RefreshCcw,
  Save,
  ShieldCheck,
  Tags,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User
} from 'firebase/auth'
import {
  getFirebaseClientDb,
  getFirebaseClientStorage,
} from "@/lib/firebaseClient";

import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { getFirebaseClientApp } from '@/lib/firebaseClient'
import { formatDkk } from '@/lib/pricing'
import type { Language, SiteCopy } from '@/lib/i18n'
import { defaultHeroImage, mergeSiteContent } from '@/lib/siteContent'
import type { AccessCodeListItem, AccessCodeRecord } from '@/types/access'
import type {
  BookingAdminAction,
  BookingRecord,
  BookingStatus
} from '@/types/booking'
import type {
  SiteContent,
  SiteImageHeight,
  SiteImageLayout
} from '@/types/site'

type AdminDashboardProps = {
  initialAuthenticated: boolean
  initialAccessCodes: AccessCodeListItem[]
  initialBookings: BookingRecord[]
  initialSiteContent: SiteContent
}

type Tab = 'bookings' | 'codes' | 'text' | 'pricing' | 'media'
type FieldPath = Array<string | number>
type CopyField = {
  label: string
  multiline: boolean
  path: FieldPath
  value: string
}

const statusLabels: Record<BookingStatus, string> = {
  inquiry: 'Inquiry',
  reserved: 'Reserved',
  booked: 'Booked',
  denied: 'Denied',
  cancelled: 'Cancelled'
}

const statusClasses: Record<BookingStatus, string> = {
  inquiry: 'bg-sand/45 text-ink',
  reserved: 'bg-champagne/25 text-olive',
  booked: 'bg-moss/15 text-olive',
  denied: 'bg-clay/10 text-clay',
  cancelled: 'bg-stone/20 text-ink/60'
}

const BOOKINGS_COLLECTION = 'bookings'
const CALENDAR_COLLECTION = 'calendar'
const CALENDAR_DOCUMENT = 'availability'
const ACCESS_CODES_COLLECTION = 'accessCodes'
const SITE_CONTENT_COLLECTION = 'siteContent'
const SITE_CONTENT_DOCUMENT = 'main'

const sectionNames: Record<string, string> = {
  nav: 'Navigation',
  hero: 'Hero',
  overview: 'Villa overview',
  experience: 'Experience',
  gallery: 'Gallery',
  amenities: 'Amenities',
  location: 'Location',
  guestGuideTeaser: 'Frontpage guide links',
  guestGuide: 'Guide pages',
  pricing: 'Pricing copy',
  booking: 'Booking form',
  footer: 'Footer'
}

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const imageHeightLabels: Record<SiteImageHeight, string> = {
  compact: 'Compact',
  standard: 'Standard',
  tall: 'Tall',
  cinematic: 'Cinematic'
}

const imageLayoutLabels: Record<SiteImageLayout, string> = {
  standard: 'Standard',
  feature: 'Large feature',
  wide: 'Wide',
  tall: 'Tall'
}

type CalendarPeriod = {
  bookingId: string
  arrivalDate: string
  departureDate: string
  status: Extract<BookingStatus, 'reserved' | 'booked'>
}

function getClientDb() {
  return getFirebaseClientDb();
}

function getClientStorage() {
  return getFirebaseClientStorage();
}


function isBlockingStatus (
  status: BookingStatus
): status is Extract<BookingStatus, 'reserved' | 'booked'> {
  return status === 'reserved' || status === 'booked'
}

function normalizeBooking (id: string, data: DocumentData): BookingRecord {
  return {
    id,
    reference: data.reference,
    language: data.language,
    name: data.name,
    email: data.email,
    arrivalDate: data.arrivalDate,
    departureDate: data.departureDate,
    guests: data.guests,
    message: data.message ?? '',
    estimatedPriceDkk: data.estimatedPriceDkk ?? data.estimatedPrice ?? 0,
    privateAccessKind: data.privateAccessKind ?? 'none',
    requiresApproval: Boolean(data.requiresApproval),
    bookingType: data.bookingType,
    status: data.status,
    nights: data.nights ?? 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    decidedAt: data.decidedAt,
    adminNote: data.adminNote
  }
}

function normalizeAccessCode (id: string, data: DocumentData): AccessCodeRecord {
  return {
    id,
    label: data.label,
    kind: data.kind,
    codeHash: data.codeHash ?? id,
    codePreview: data.codePreview,
    active: Boolean(data.active),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}

function toAccessCodeListItem (
  accessCode: AccessCodeRecord
): AccessCodeListItem {
  return {
    id: accessCode.id,
    label: accessCode.label,
    kind: accessCode.kind,
    codePreview: accessCode.codePreview,
    active: accessCode.active,
    createdAt: accessCode.createdAt,
    updatedAt: accessCode.updatedAt
  }
}

function getCalendarPeriods (data: DocumentData | undefined): CalendarPeriod[] {
  return Array.isArray(data?.periods) ? data.periods : []
}

function getCodePreview (code: string) {
  const trimmed = code.trim()

  if (trimmed.length <= 4) {
    return '****'
  }

  return `**** ${trimmed.slice(-4)}`
}

async function hashAccessCode (code: string) {
  const bytes = new TextEncoder().encode(code.trim())
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

function safeFilename (name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getFirebaseErrorMessage (error: unknown, fallback: string) {
  const code =
    isRecord(error) && typeof error.code === 'string' ? error.code : ''
  const message =
    isRecord(error) && typeof error.message === 'string' ? error.message : ''

  if (code === 'permission-denied') {
    return `${fallback} Firebase denied the write. Deploy firestore.rules/storage.rules and make sure this user has admins/{uid}.`
  }

  if (code) {
    return `${fallback} Firebase error: ${code}.`
  }

  if (message) {
    return `${fallback} ${message}`
  }

  return fallback
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function humanize (value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, letter => letter.toUpperCase())
}

function getCopyFieldLabel (path: FieldPath) {
  const section = sectionNames[String(path[0])] ?? humanize(String(path[0]))

  if (path[0] === 'guestGuide') {
    const page = humanize(String(path[1]))

    if (
      path[1] === 'activities' &&
      path[2] === 'golf' &&
      path[3] === 'courses' &&
      typeof path[4] === 'number'
    ) {
      return `${section}: Activities golf course ${path[4] + 1} ${humanize(
        String(path[5])
      )}`
    }

    if (
      path[1] === 'activities' &&
      path[2] === 'other' &&
      path[3] === 'groups' &&
      typeof path[4] === 'number'
    ) {
      const groupLabel = `${section}: Activities other group ${path[4] + 1}`

      if (path[5] === 'links' && typeof path[6] === 'number') {
        return `${groupLabel} link ${path[6] + 1} ${humanize(
          String(path[7])
        )}`
      }

      return `${groupLabel} ${humanize(String(path[path.length - 1]))}`
    }

    if (path[2] === 'groups' && typeof path[3] === 'number') {
      const groupLabel = `${section}: ${page} group ${path[3] + 1}`

      if (path[4] === 'links' && typeof path[5] === 'number') {
        return `${groupLabel} link ${path[5] + 1} ${humanize(
          String(path[6])
        )}`
      }

      if (path[4] === 'items' && typeof path[5] === 'number') {
        return `${groupLabel} item ${path[5] + 1}`
      }

      return `${groupLabel} ${humanize(String(path[path.length - 1]))}`
    }

    return `${section}: ${page} ${humanize(String(path[path.length - 1]))}`
  }

  if (path[0] === 'amenities' && path[1] === 'items') {
    return `${section}: item ${Number(path[2]) + 1} ${humanize(
      String(path[3])
    )}`
  }

  if (path[0] === 'overview' && path[1] === 'items') {
    return `${section}: metric ${Number(path[2]) + 1} ${humanize(
      String(path[3])
    )}`
  }

  if (
    (path[1] === 'features' ||
      path[1] === 'paragraphs' ||
      path[1] === 'details' ||
      path[1] === 'notes') &&
    typeof path[2] === 'number'
  ) {
    return `${section}: ${humanize(String(path[1]))} ${path[2] + 1}`
  }

  return `${section}: ${humanize(String(path[path.length - 1]))}`
}

function shouldUseTextarea (path: FieldPath, value: string) {
  const key = String(path[path.length - 1]).toLowerCase()
  return (
    value.length > 72 ||
    key.includes('body') ||
    key.includes('tagline') ||
    key.includes('placeholder') ||
    key.includes('note') ||
    path.includes('paragraphs')
  )
}

function collectCopyFields (value: unknown, path: FieldPath = []): CopyField[] {
  if (typeof value === 'string') {
    return [
      {
        label: getCopyFieldLabel(path),
        multiline: shouldUseTextarea(path, value),
        path,
        value
      }
    ]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectCopyFields(item, [...path, index])
    )
  }

  if (isRecord(value)) {
    return Object.entries(value).flatMap(([key, item]) =>
      collectCopyFields(item, [...path, key])
    )
  }

  return []
}
function removeUndefinedDeep<T> (value: T): T {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedDeep) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removeUndefinedDeep(item)])
    ) as T
  }

  return value
}
function setDeepValue<T> (source: T, path: FieldPath, value: string): T {
  const clone = structuredClone(source) as unknown
  let cursor: unknown = clone

  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index]

    if (Array.isArray(cursor)) {
      cursor = cursor[Number(segment)]
    } else if (isRecord(cursor)) {
      cursor = cursor[String(segment)]
    } else {
      return source
    }
  }

  const finalSegment = path[path.length - 1]

  if (Array.isArray(cursor)) {
    cursor[Number(finalSegment)] = value
  } else if (isRecord(cursor)) {
    cursor[String(finalSegment)] = value
  }

  return clone as T
}

export default function AdminDashboard ({
  initialAuthenticated,
  initialAccessCodes,
  initialBookings,
  initialSiteContent
}: AdminDashboardProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('bookings')
  const [accessCodes, setAccessCodes] = useState(initialAccessCodes)
  const [newCodeLabel, setNewCodeLabel] = useState('')
  const [newCodeKind, setNewCodeKind] = useState<'friend' | 'family'>('friend')
  const [newCodeValue, setNewCodeValue] = useState('')
  const [bookings, setBookings] = useState(initialBookings)
  const [siteContent, setSiteContent] = useState(initialSiteContent)
  const [editorLanguage, setEditorLanguage] = useState<Language>('da')
  const [savingSiteContent, setSavingSiteContent] = useState(false)
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const siteContentRef = useRef(siteContent)
  const siteContentSaveQueueRef = useRef<Promise<void>>(Promise.resolve())
  const siteContentSaveVersionRef = useRef(0)

  const upcomingBookings = useMemo(
    () =>
      bookings.filter(
        booking => booking.status === 'reserved' || booking.status === 'booked'
      ),
    [bookings]
  )
  const copyFields = useMemo(
    () => collectCopyFields(siteContent.copy[editorLanguage]),
    [editorLanguage, siteContent.copy]
  )

  useEffect(() => {
    siteContentRef.current = siteContent
  }, [siteContent])

  function applySiteContentUpdate (
    updater: (current: SiteContent) => SiteContent
  ) {
    const nextContent = updater(siteContentRef.current)
    siteContentRef.current = nextContent
    setSiteContent(nextContent)
    return nextContent
  }

  async function assertAdminAccess (user: User) {
    const adminDoc = await getDoc(doc(getClientDb(), 'admins', user.uid))

    if (!adminDoc.exists()) {
      throw new Error(`Missing Firestore admin document admins/${user.uid}`)
    }
  }

  async function loadAdminData (user: User) {
    await assertAdminAccess(user)
    await Promise.all([
      refreshBookings(),
      refreshAccessCodes(),
      refreshSiteContent()
    ])
  }

  useEffect(() => {
    const auth = getAuth(getFirebaseClientApp())

    return onAuthStateChanged(auth, user => {
      if (!user) {
        setAuthenticated(false)
        return
      }

      setAuthenticated(true)
      void loadAdminData(user).catch(async error => {
        setLoginError(
          getFirebaseErrorMessage(
            error,
            'This Firebase user is not allowed to manage Casa Mimosa.'
          )
        )
        setAuthenticated(false)
        await signOut(auth).catch(() => undefined)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogin (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError('')

    try {
      const auth = getAuth(getFirebaseClientApp())
      const credential = await signInWithEmailAndPassword(auth, email, password)
      setAuthenticated(true)
      await loadAdminData(credential.user)
      setEmail('')
      setPassword('')
    } catch (error) {
      setAuthenticated(false)
      setLoginError(
        getFirebaseErrorMessage(
          error,
          'Login failed, or this user is not allowed to manage Casa Mimosa.'
        )
      )
    }
  }

  async function logout () {
    await signOut(getAuth(getFirebaseClientApp())).catch(() => undefined)
    setAuthenticated(false)
  }

  async function refreshBookings () {
    const db = getClientDb()
    const snapshot = await getDocs(
      query(collection(db, BOOKINGS_COLLECTION), orderBy('createdAt', 'desc'))
    )
    setBookings(
      snapshot.docs.map(bookingDoc =>
        normalizeBooking(bookingDoc.id, bookingDoc.data())
      )
    )
  }

  async function refreshAccessCodes () {
    const db = getClientDb()
    const snapshot = await getDocs(
      query(
        collection(db, ACCESS_CODES_COLLECTION),
        orderBy('createdAt', 'desc')
      )
    )
    setAccessCodes(
      snapshot.docs.map(accessCodeDoc =>
        toAccessCodeListItem(
          normalizeAccessCode(accessCodeDoc.id, accessCodeDoc.data())
        )
      )
    )
  }

  async function refreshSiteContent () {
    const db = getClientDb()
    const snapshot = await getDoc(
      doc(db, SITE_CONTENT_COLLECTION, SITE_CONTENT_DOCUMENT)
    )
    setSiteContent(
      mergeSiteContent(
        snapshot.exists() ? (snapshot.data() as Partial<SiteContent>) : null
      )
    )
  }

  async function createCode (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('')

    try {
      const db = getClientDb()
      const now = new Date().toISOString()
      const codeHash = await hashAccessCode(newCodeValue)
      const codeRef = doc(db, ACCESS_CODES_COLLECTION, codeHash)
      const existing = await getDoc(codeRef)

      if (existing.exists()) {
        setNotice('Code already exists.')
        return
      }

      const record: AccessCodeRecord = {
        id: codeHash,
        label: newCodeLabel.trim(),
        kind: newCodeKind,
        codeHash,
        codePreview: getCodePreview(newCodeValue),
        active: true,
        createdAt: now,
        updatedAt: now
      }

      await setDoc(codeRef, {
        ...record,
        serverCreatedAt: serverTimestamp(),
        serverUpdatedAt: serverTimestamp()
      })

      setAccessCodes(items => [toAccessCodeListItem(record), ...items])
      setNewCodeLabel('')
      setNewCodeValue('')
      setNotice('Code created. It can be used immediately.')
    } catch (error) {
      setNotice(getFirebaseErrorMessage(error, 'Code could not be created.'))
    }
  }

  async function deleteCode (id: string) {
    setNotice('')

    try {
      await deleteDoc(doc(getClientDb(), ACCESS_CODES_COLLECTION, id))
      setAccessCodes(items => items.filter(item => item.id !== id))
      setNotice('Code removed.')
    } catch (error) {
      setNotice(getFirebaseErrorMessage(error, 'Code could not be deleted.'))
    }
  }

  async function updateBooking (id: string, action: BookingAdminAction) {
    setNotice('')
    const now = new Date().toISOString()
    const statusByAction: Record<BookingAdminAction, BookingStatus> = {
      approve: 'booked',
      deny: 'denied',
      cancel: 'cancelled'
    }
    const nextStatus = statusByAction[action]

    try {
      const db = getClientDb()
      const updatedBooking = await runTransaction(db, async transaction => {
        const bookingRef = doc(db, BOOKINGS_COLLECTION, id)
        const calendarRef = doc(db, CALENDAR_COLLECTION, CALENDAR_DOCUMENT)
        const bookingSnapshot = await transaction.get(bookingRef)

        if (!bookingSnapshot.exists()) {
          throw new Error('BOOKING_NOT_FOUND')
        }

        const booking = normalizeBooking(
          bookingSnapshot.id,
          bookingSnapshot.data()
        )
        const calendarSnapshot = await transaction.get(calendarRef)
        const currentPeriods = getCalendarPeriods(
          calendarSnapshot.data()
        ).filter(period => period.bookingId !== id)
        const nextPeriods = isBlockingStatus(nextStatus)
          ? [
              ...currentPeriods,
              {
                bookingId: id,
                arrivalDate: booking.arrivalDate,
                departureDate: booking.departureDate,
                status: nextStatus
              }
            ]
          : currentPeriods

        transaction.update(bookingRef, {
          status: nextStatus,
          requiresApproval: false,
          updatedAt: now,
          decidedAt: now,
          adminNote: '',
          serverUpdatedAt: serverTimestamp()
        })
        transaction.set(
          calendarRef,
          {
            periods: nextPeriods,
            updatedAt: now,
            serverUpdatedAt: serverTimestamp()
          },
          { merge: true }
        )

        return {
          ...booking,
          status: nextStatus,
          requiresApproval: false,
          updatedAt: now,
          decidedAt: now,
          adminNote: ''
        }
      })

      setBookings(items =>
        items.map(item => (item.id === id ? updatedBooking : item))
      )
    } catch (error) {
      setNotice(getFirebaseErrorMessage(error, 'Could not update booking.'))
    }
  }

  function updateCopy (language: Language, path: FieldPath, value: string) {
    applySiteContentUpdate(current => ({
      ...current,
      copy: {
        ...current.copy,
        [language]: setDeepValue<SiteCopy>(current.copy[language], path, value)
      }
    }))
  }

  function updateGuideCopy (updater: (current: SiteCopy) => SiteCopy) {
    return applySiteContentUpdate(current => ({
      ...current,
      copy: {
        ...current.copy,
        [editorLanguage]: updater(current.copy[editorLanguage])
      }
    }))
  }

  function addGolfCourse () {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        activities: {
          ...current.guestGuide.activities,
          golf: {
            ...current.guestGuide.activities.golf,
            courses: [
              ...current.guestGuide.activities.golf.courses,
              {
                title: editorLanguage === 'da' ? 'Ny golfbane' : 'New golf course',
                eyebrow: editorLanguage === 'da' ? 'Golfbane' : 'Golf course',
                description:
                  editorLanguage === 'da'
                    ? 'Beskriv banen kort.'
                    : 'Describe this course briefly.',
                href: 'https://example.com',
                mapQuery: 'Golf course near Mijas'
              }
            ]
          }
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function removeGolfCourse (courseIndex: number) {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        activities: {
          ...current.guestGuide.activities,
          golf: {
            ...current.guestGuide.activities.golf,
            courses: current.guestGuide.activities.golf.courses.filter(
              (_, index) => index !== courseIndex
            )
          }
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function addActivityGroup () {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        activities: {
          ...current.guestGuide.activities,
          other: {
            ...current.guestGuide.activities.other,
            groups: [
              ...current.guestGuide.activities.other.groups,
            {
              title: editorLanguage === 'da' ? 'Ny sektion' : 'New section',
              description:
                editorLanguage === 'da'
                  ? 'Beskriv sektionen kort.'
                  : 'Describe this section briefly.',
              links: []
            }
            ]
          }
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function removeActivityGroup (groupIndex: number) {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        activities: {
          ...current.guestGuide.activities,
          other: {
            ...current.guestGuide.activities.other,
            groups: current.guestGuide.activities.other.groups.filter(
              (_, index) => index !== groupIndex
            )
          }
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function addActivityLink (groupIndex: number) {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        activities: {
          ...current.guestGuide.activities,
          other: {
            ...current.guestGuide.activities.other,
            groups: current.guestGuide.activities.other.groups.map((group, index) =>
              index === groupIndex
                ? {
                    ...group,
                    links: [
                      ...group.links,
                      {
                        title: editorLanguage === 'da' ? 'Nyt link' : 'New link',
                        eyebrow:
                          editorLanguage === 'da'
                            ? 'Officielt link'
                            : 'Official link',
                        description:
                          editorLanguage === 'da'
                            ? 'Beskriv stedet kort.'
                            : 'Describe this place briefly.',
                        href: 'https://example.com'
                      }
                    ]
                  }
                : group
            )
          }
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function removeActivityLink (groupIndex: number, linkIndex: number) {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        activities: {
          ...current.guestGuide.activities,
          other: {
            ...current.guestGuide.activities.other,
            groups: current.guestGuide.activities.other.groups.map((group, index) =>
              index === groupIndex
                ? {
                    ...group,
                    links: group.links.filter(
                      (_, currentLinkIndex) => currentLinkIndex !== linkIndex
                    )
                  }
                : group
            )
          }
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function addInventoryGroup () {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        inventory: {
          ...current.guestGuide.inventory,
          groups: [
            ...current.guestGuide.inventory.groups,
            {
              title: editorLanguage === 'da' ? 'Ny kategori' : 'New category',
              description:
                editorLanguage === 'da'
                  ? 'Beskriv kategorien kort.'
                  : 'Describe this category briefly.',
              items: []
            }
          ]
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function removeInventoryGroup (groupIndex: number) {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        inventory: {
          ...current.guestGuide.inventory,
          groups: current.guestGuide.inventory.groups.filter(
            (_, index) => index !== groupIndex
          )
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function addInventoryItem (groupIndex: number) {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        inventory: {
          ...current.guestGuide.inventory,
          groups: current.guestGuide.inventory.groups.map((group, index) =>
            index === groupIndex
              ? {
                  ...group,
                  items: [
                    ...group.items,
                    editorLanguage === 'da' ? 'Nyt punkt' : 'New item'
                  ]
                }
              : group
          )
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function removeInventoryItem (groupIndex: number, itemIndex: number) {
    const nextContent = updateGuideCopy(current => ({
      ...current,
      guestGuide: {
        ...current.guestGuide,
        inventory: {
          ...current.guestGuide.inventory,
          groups: current.guestGuide.inventory.groups.map((group, index) =>
            index === groupIndex
              ? {
                  ...group,
                  items: group.items.filter(
                    (_, currentItemIndex) => currentItemIndex !== itemIndex
                  )
                }
              : group
          )
        }
      }
    }))

    void saveSiteContent('Guide updated.', nextContent)
  }

  function updatePricing (
    index: number,
    updater: (
      current: SiteContent['pricing'][number]
    ) => SiteContent['pricing'][number]
  ) {
    applySiteContentUpdate(current => ({
      ...current,
      pricing: current.pricing.map((season, seasonIndex) =>
        seasonIndex === index ? updater(season) : season
      )
    }))
  }

  function togglePricingMonth (index: number, month: number) {
    updatePricing(index, season => {
      const hasMonth = season.months.includes(month)
      const months = hasMonth
        ? season.months.filter(item => item !== month)
        : [...season.months, month].sort((a, b) => a - b)

      return {
        ...season,
        months: months.length > 0 ? months : season.months
      }
    })
  }

  function updateImage (
    index: number,
    updater: (
      current: SiteContent['images'][number]
    ) => SiteContent['images'][number]
  ) {
    return applySiteContentUpdate(current => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? updater(image) : image
      )
    }))
  }

  function addGalleryImage () {
    const nextContent = applySiteContentUpdate(current => {
      const galleryImages = current.images.filter(image =>
        image.slot.startsWith('gallery-')
      )
      const fallback = galleryImages[galleryImages.length - 1] ?? current.images[0]
      const nextNumber = galleryImages.length + 1
      const newImage: SiteContent['images'][number] = {
        slot: `gallery-${Date.now().toString(36)}`,
        label: `Gallery image ${nextNumber}`,
        src: fallback?.src ?? defaultHeroImage,
        alt: {
          da: fallback?.alt.da ?? 'Casa Mimosa galleri billede',
          en: fallback?.alt.en ?? 'Casa Mimosa gallery image'
        },
        presentation: {
          focalX: 50,
          focalY: 50,
          height: 'standard',
          galleryLayout: 'standard'
        }
      }

      const nextContent = {
        ...current,
        images: [
          ...current.images,
          newImage
        ]
      }
      return nextContent
    })
    void saveSiteContent('Gallery image added.', nextContent)
  }

  function removeGalleryImage (index: number) {
    const nextContent = applySiteContentUpdate(current => ({
      ...current,
      images: current.images.filter((image, imageIndex) => {
        if (imageIndex !== index) {
          return true
        }

        return !image.slot.startsWith('gallery-')
      })
    }))
    void saveSiteContent('Gallery image removed.', nextContent)
  }

  async function saveSiteContent (
    successMessage: string,
    contentToSave: SiteContent = siteContentRef.current
  ) {
    const saveVersion = siteContentSaveVersionRef.current + 1
    siteContentSaveVersionRef.current = saveVersion
    setSavingSiteContent(true)
    setNotice('')

    const saveTask = siteContentSaveQueueRef.current.then(async () => {
      try {
        const updated = {
          ...mergeSiteContent(contentToSave),
          updatedAt: new Date().toISOString()
        }

        const cleanUpdated = removeUndefinedDeep(updated)

        await setDoc(
          doc(getClientDb(), SITE_CONTENT_COLLECTION, SITE_CONTENT_DOCUMENT),
          {
            ...cleanUpdated,
            serverUpdatedAt: serverTimestamp()
          },
          { merge: true }
        )

        if (saveVersion === siteContentSaveVersionRef.current) {
          siteContentRef.current = cleanUpdated
          setSiteContent(cleanUpdated)
          setNotice(successMessage)
        }
      } catch (error) {
        console.error('SAVE SITE CONTENT ERROR', error)

        if (saveVersion === siteContentSaveVersionRef.current) {
          setNotice(
            getFirebaseErrorMessage(error, 'Site content could not be saved.')
          )
        }
      } finally {
        if (saveVersion === siteContentSaveVersionRef.current) {
          setSavingSiteContent(false)
        }
      }
    })

    siteContentSaveQueueRef.current = saveTask.catch(() => undefined)
    await saveTask
  }

  async function uploadImage (index: number, file: File | undefined) {
    if (!file) {
      return
    }

    setUploadingSlot(siteContent.images[index]?.slot ?? null)
    setNotice('')

    try {
      const slot = siteContent.images[index]?.slot ?? 'site-image'
      const objectName = `site-images/${slot}-${Date.now()}-${safeFilename(
        file.name
      )}`
      const storageRef = ref(getClientStorage(), objectName)

      await uploadBytes(storageRef, file, {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000'
      })
      const url = await getDownloadURL(storageRef)

      const nextContent = updateImage(index, image => ({ ...image, src: url }))
      await saveSiteContent('Image uploaded and saved.', nextContent)
    } catch (error) {
      setNotice(getFirebaseErrorMessage(error, 'Image could not be uploaded.'))
    } finally {
      setUploadingSlot(null)
    }
  }

  if (!authenticated) {
    return (
      <main className='min-h-screen bg-ivory px-4 py-12 text-ink'>
        <section className='mx-auto mt-20 w-full max-w-md rounded-[8px] border border-olive/10 bg-porcelain p-6 shadow-soft'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-olive text-ivory'>
            <ShieldCheck className='h-5 w-5' aria-hidden='true' />
          </div>
          <h1 className='mt-5 font-serif text-4xl text-olive'>
            Casa Mimosa Admin
          </h1>
          <p className='mt-3 text-sm leading-6 text-ink/62'>
            Log in to manage reservations, codes, written content, pricing and
            images.
          </p>
          <form className='mt-6' onSubmit={handleLogin}>
            <InputLabel label='Email'>
              <input
                required
                type='email'
                value={email}
                placeholder='owner@example.com'
                onChange={event => setEmail(event.target.value)}
                className='h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30'
              />
            </InputLabel>
            <InputLabel label='Password'>
              <input
                required
                type='password'
                value={password}
                onChange={event => setPassword(event.target.value)}
                className='h-12 w-full rounded-[8px] border border-olive/14 bg-ivory px-4 outline-none transition focus:border-champagne focus:ring-2 focus:ring-champagne/30'
              />
            </InputLabel>
            {loginError ? (
              <p className='mt-3 text-sm font-semibold text-clay'>
                {loginError}
              </p>
            ) : null}
            <button className='mt-6 h-12 w-full rounded-full bg-olive px-5 text-sm font-bold text-ivory transition hover:bg-dusk'>
              Log in
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-ivory text-ink'>
      <header className='border-b border-olive/10 bg-porcelain'>
        <div className='section-shell flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase text-champagne'>
              Casa Mimosa
            </p>
            <h1 className='font-serif text-4xl text-olive'>Admin Terminal</h1>
          </div>
          <div className='flex flex-wrap gap-3'>
            <button
              type='button'
              onClick={() =>
                void Promise.all([refreshBookings(), refreshSiteContent()])
              }
              className='inline-flex h-11 items-center gap-2 rounded-full border border-olive/15 px-4 text-sm font-bold text-olive'
            >
              <RefreshCcw className='h-4 w-4' aria-hidden='true' />
              Refresh
            </button>
            <button
              type='button'
              onClick={() => void logout()}
              className='inline-flex h-11 items-center gap-2 rounded-full bg-olive px-4 text-sm font-bold text-ivory'
            >
              <LogOut className='h-4 w-4' aria-hidden='true' />
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className='section-shell py-8'>
        <div className='grid gap-4 md:grid-cols-3'>
          <Metric
            label='Active blocks'
            value={upcomingBookings.length.toString()}
          />
          <Metric
            label='Awaiting approval'
            value={bookings
              .filter(booking => booking.status === 'reserved')
              .length.toString()}
          />
          <Metric
            label='Confirmed'
            value={bookings
              .filter(booking => booking.status === 'booked')
              .length.toString()}
          />
        </div>

        <div className='mt-8 flex gap-2 overflow-x-auto border-b border-olive/10'>
          <TabButton
            active={tab === 'bookings'}
            onClick={() => setTab('bookings')}
          >
            Reservations
          </TabButton>
          <TabButton active={tab === 'codes'} onClick={() => setTab('codes')}>
            Codes
          </TabButton>
          <TabButton active={tab === 'text'} onClick={() => setTab('text')}>
            Text
          </TabButton>
          <TabButton
            active={tab === 'pricing'}
            onClick={() => setTab('pricing')}
          >
            Pricing
          </TabButton>
          <TabButton active={tab === 'media'} onClick={() => setTab('media')}>
            Media
          </TabButton>
        </div>

        {notice ? (
          <p className='mt-5 rounded-[8px] bg-champagne/15 px-4 py-3 text-sm font-semibold text-olive'>
            {notice}
          </p>
        ) : null}

        {tab === 'bookings' ? (
          <BookingsTab bookings={bookings} onUpdateBooking={updateBooking} />
        ) : null}

        {tab === 'codes' ? (
          <CodesTab
            accessCodes={accessCodes}
            newCodeKind={newCodeKind}
            newCodeLabel={newCodeLabel}
            newCodeValue={newCodeValue}
            onCreateCode={createCode}
            onDeleteCode={deleteCode}
            onNewCodeKindChange={setNewCodeKind}
            onNewCodeLabelChange={setNewCodeLabel}
            onNewCodeValueChange={setNewCodeValue}
          />
        ) : null}

        {tab === 'text' ? (
          <section className='mt-6 rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <div className='flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory'>
                  <FileText className='h-5 w-5' aria-hidden='true' />
                </div>
                <h2 className='mt-5 font-serif text-3xl text-olive'>
                  Site text
                </h2>
                <p className='mt-2 text-sm leading-6 text-ink/62'>
                  Edit public text across the frontpage, activities page and
                  inventory page. Switch language before editing.
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <LanguageButton
                  active={editorLanguage === 'da'}
                  onClick={() => setEditorLanguage('da')}
                >
                  Danish
                </LanguageButton>
                <LanguageButton
                  active={editorLanguage === 'en'}
                  onClick={() => setEditorLanguage('en')}
                >
                  English
                </LanguageButton>
                <SaveButton
                  disabled={savingSiteContent}
                  onClick={() => void saveSiteContent('Text saved.')}
                >
                  Save text
                </SaveButton>
              </div>
            </div>

            <div className='mt-6 grid gap-4 lg:grid-cols-2'>
              {copyFields.map(field => (
                <InputLabel
                  key={`${editorLanguage}-${field.path.join('.')}`}
                  label={field.label}
                >
                  {field.multiline ? (
                    <textarea
                      rows={4}
                      value={field.value}
                      onChange={event =>
                        updateCopy(
                          editorLanguage,
                          field.path,
                          event.target.value
                        )
                      }
                      onBlur={() =>
                        void saveSiteContent('Text autosaved.')
                      }
                      className='w-full resize-y rounded-[8px] border border-olive/14 bg-ivory px-3 py-3 text-sm leading-6 outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                    />
                  ) : (
                    <input
                      value={field.value}
                      onChange={event =>
                        updateCopy(
                          editorLanguage,
                          field.path,
                          event.target.value
                        )
                      }
                      onBlur={() =>
                        void saveSiteContent('Text autosaved.')
                      }
                      className='h-11 w-full rounded-[8px] border border-olive/14 bg-ivory px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                    />
                  )}
                </InputLabel>
              ))}
            </div>

            <GuideStructureEditor
              content={siteContent.copy[editorLanguage]}
              onAddActivityGroup={addActivityGroup}
              onAddActivityLink={addActivityLink}
              onAddGolfCourse={addGolfCourse}
              onAddInventoryGroup={addInventoryGroup}
              onAddInventoryItem={addInventoryItem}
              onRemoveActivityGroup={removeActivityGroup}
              onRemoveActivityLink={removeActivityLink}
              onRemoveGolfCourse={removeGolfCourse}
              onRemoveInventoryGroup={removeInventoryGroup}
              onRemoveInventoryItem={removeInventoryItem}
            />
          </section>
        ) : null}

        {tab === 'pricing' ? (
          <section className='mt-6 rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <div className='flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory'>
                  <Tags className='h-5 w-5' aria-hidden='true' />
                </div>
                <h2 className='mt-5 font-serif text-3xl text-olive'>
                  Pricing and seasons
                </h2>
                <p className='mt-2 text-sm leading-6 text-ink/62'>
                  These prices are used on the public pricing section and in
                  booking estimates.
                </p>
              </div>
              <SaveButton
                disabled={savingSiteContent}
                onClick={() => void saveSiteContent('Pricing saved.')}
              >
                Save pricing
              </SaveButton>
            </div>

            <div className='mt-6 grid gap-5 xl:grid-cols-2'>
              {siteContent.pricing.map((season, index) => (
                <article
                  key={season.key}
                  className='rounded-[8px] border border-olive/10 bg-ivory p-5'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-xs font-bold uppercase text-champagne'>
                        {season.key}
                      </p>
                      <h3 className='mt-2 font-serif text-3xl text-olive'>
                        {season.label.en}
                      </h3>
                    </div>
                    <p className='rounded-full bg-moss/12 px-3 py-1 text-sm font-bold text-olive'>
                      {formatDkk(season.dkkPerDay)}
                    </p>
                  </div>
                  <div className='mt-5 grid gap-4 md:grid-cols-2'>
                    <InputLabel label='Price per day, DKK'>
                      <input
                        type='number'
                        min={0}
                        value={season.dkkPerDay}
                        onChange={event =>
                          updatePricing(index, current => ({
                            ...current,
                            dkkPerDay: Number(event.target.value)
                          }))
                        }
                        onBlur={() =>
                          void saveSiteContent('Pricing autosaved.')
                        }
                        className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                      />
                    </InputLabel>
                    <InputLabel label='Danish label'>
                      <input
                        value={season.label.da}
                        onChange={event =>
                          updatePricing(index, current => ({
                            ...current,
                            label: { ...current.label, da: event.target.value }
                          }))
                        }
                        onBlur={() =>
                          void saveSiteContent('Pricing autosaved.')
                        }
                        className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                      />
                    </InputLabel>
                    <InputLabel label='English label'>
                      <input
                        value={season.label.en}
                        onChange={event =>
                          updatePricing(index, current => ({
                            ...current,
                            label: { ...current.label, en: event.target.value }
                          }))
                        }
                        onBlur={() =>
                          void saveSiteContent('Pricing autosaved.')
                        }
                        className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                      />
                    </InputLabel>
                    <InputLabel label='Danish period text'>
                      <input
                        value={season.period.da}
                        onChange={event =>
                          updatePricing(index, current => ({
                            ...current,
                            period: {
                              ...current.period,
                              da: event.target.value
                            }
                          }))
                        }
                        onBlur={() =>
                          void saveSiteContent('Pricing autosaved.')
                        }
                        className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                      />
                    </InputLabel>
                    <InputLabel label='English period text'>
                      <input
                        value={season.period.en}
                        onChange={event =>
                          updatePricing(index, current => ({
                            ...current,
                            period: {
                              ...current.period,
                              en: event.target.value
                            }
                          }))
                        }
                        onBlur={() =>
                          void saveSiteContent('Pricing autosaved.')
                        }
                        className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                      />
                    </InputLabel>
                  </div>
                  <div className='mt-5'>
                    <p className='mb-2 block text-xs font-bold uppercase text-ink/48'>
                      Months in this season
                    </p>
                    <div className='grid grid-cols-3 gap-2 sm:grid-cols-6'>
                      {monthNames.map((monthName, monthIndex) => {
                        const month = monthIndex + 1
                        const active = season.months.includes(month)

                        return (
                          <button
                            key={month}
                            type='button'
                            onClick={() => togglePricingMonth(index, month)}
                            className={`h-10 rounded-full border px-3 text-xs font-bold ${
                              active
                                ? 'border-olive bg-olive text-ivory'
                                : 'border-olive/12 bg-porcelain text-ink/58'
                            }`}
                          >
                            {monthName}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {tab === 'media' ? (
          <section className='mt-6 rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <div className='flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory'>
                  <ImageIcon className='h-5 w-5' aria-hidden='true' />
                </div>
                <h2 className='mt-5 font-serif text-3xl text-olive'>
                  Images and layout
                </h2>
                <p className='mt-2 text-sm leading-6 text-ink/62'>
                  Replace images, adjust crop focus, and choose display size or
                  gallery layout.
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <button
                  type='button'
                  onClick={addGalleryImage}
                  className='inline-flex h-11 items-center justify-center gap-2 rounded-full border border-olive/15 px-5 text-sm font-bold text-olive'
                >
                  <Plus className='h-4 w-4' aria-hidden='true' />
                  Add gallery image
                </button>
                <SaveButton
                  disabled={savingSiteContent}
                  onClick={() => void saveSiteContent('Media saved.')}
                >
                  Save media
                </SaveButton>
              </div>
            </div>

            <div className='mt-6 grid gap-5'>
              {siteContent.images.map((image, index) => {
                const isGalleryImage = image.slot.startsWith('gallery-')

                return (
                  <div
                    className='rounded-[8px] border border-olive/10 bg-ivory p-4'
                    key={image.slot}
                  >
                    <div className='grid gap-4 xl:grid-cols-[220px_1fr]'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.src}
                        alt={image.alt.en}
                        className='h-40 w-full rounded-[8px] object-cover'
                        style={{
                          objectPosition: `${image.presentation.focalX}% ${image.presentation.focalY}%`
                        }}
                      />
                      <div>
                        <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                          <div>
                            <p className='font-semibold text-olive'>
                              {image.label}
                            </p>
                            <p className='mt-1 text-sm text-ink/50'>
                              {image.slot}
                            </p>
                          </div>
                          <div className='flex flex-wrap gap-2'>
                            <label className='inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-olive px-4 text-sm font-bold text-ivory'>
                              <Upload className='h-4 w-4' aria-hidden='true' />
                              {uploadingSlot === image.slot
                                ? 'Uploading...'
                                : 'Upload'}
                              <input
                                type='file'
                                accept='image/*'
                                disabled={uploadingSlot === image.slot}
                                onChange={event =>
                                  void uploadImage(
                                    index,
                                    event.target.files?.[0]
                                  )
                                }
                                className='sr-only'
                              />
                            </label>
                            {isGalleryImage ? (
                              <button
                                type='button'
                                onClick={() => removeGalleryImage(index)}
                                className='inline-flex h-10 items-center gap-2 rounded-full border border-clay/25 px-4 text-sm font-bold text-clay'
                              >
                                <Trash2
                                  className='h-4 w-4'
                                  aria-hidden='true'
                                />
                                Remove
                              </button>
                            ) : null}
                          </div>
                        </div>
                        <div className='mt-4 grid gap-4 lg:grid-cols-2'>
                          <InputLabel label='Admin label'>
                            <input
                              value={image.label}
                              onChange={event =>
                                updateImage(index, current => ({
                                  ...current,
                                  label: event.target.value
                                }))
                              }
                              onBlur={() =>
                                void saveSiteContent('Media autosaved.')
                              }
                              className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                            />
                          </InputLabel>
                          <InputLabel label='Image URL'>
                            <input
                              value={image.src}
                              onChange={event =>
                                updateImage(index, current => ({
                                  ...current,
                                  src: event.target.value
                                }))
                              }
                              onBlur={() =>
                                void saveSiteContent('Media autosaved.')
                              }
                              className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                            />
                          </InputLabel>
                          <InputLabel label='Alt text Danish'>
                            <input
                              value={image.alt.da}
                              onChange={event =>
                                updateImage(index, current => ({
                                  ...current,
                                  alt: {
                                    ...current.alt,
                                    da: event.target.value
                                  }
                                }))
                              }
                              onBlur={() =>
                                void saveSiteContent('Media autosaved.')
                              }
                              className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                            />
                          </InputLabel>
                          <InputLabel label='Alt text English'>
                            <input
                              value={image.alt.en}
                              onChange={event =>
                                updateImage(index, current => ({
                                  ...current,
                                  alt: {
                                    ...current.alt,
                                    en: event.target.value
                                  }
                                }))
                              }
                              onBlur={() =>
                                void saveSiteContent('Media autosaved.')
                              }
                              className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                            />
                          </InputLabel>
                          <InputLabel label='Horizontal focus'>
                            <input
                              type='range'
                              min={0}
                              max={100}
                              value={image.presentation.focalX}
                              onChange={event =>
                                updateImage(index, current => ({
                                  ...current,
                                  presentation: {
                                    ...current.presentation,
                                    focalX: Number(event.target.value)
                                  }
                                }))
                              }
                              className='w-full accent-olive'
                            />
                          </InputLabel>
                          <InputLabel label='Vertical focus'>
                            <input
                              type='range'
                              min={0}
                              max={100}
                              value={image.presentation.focalY}
                              onChange={event =>
                                updateImage(index, current => ({
                                  ...current,
                                  presentation: {
                                    ...current.presentation,
                                    focalY: Number(event.target.value)
                                  }
                                }))
                              }
                              className='w-full accent-olive'
                            />
                          </InputLabel>
                          {isGalleryImage ? (
                            <InputLabel label='Gallery layout'>
                              <select
                                value={image.presentation.galleryLayout}
                                onChange={event =>
                                  updateImage(index, current => ({
                                    ...current,
                                    presentation: {
                                      ...current.presentation,
                                      galleryLayout: event.target
                                        .value as SiteImageLayout
                                    }
                                  }))
                                }
                                className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                              >
                                {Object.entries(imageLayoutLabels).map(
                                  ([value, label]) => (
                                    <option key={value} value={value}>
                                      {label}
                                    </option>
                                  )
                                )}
                              </select>
                            </InputLabel>
                          ) : (
                            <InputLabel label='Display height'>
                              <select
                                value={image.presentation.height}
                                onChange={event =>
                                  updateImage(index, current => ({
                                    ...current,
                                    presentation: {
                                      ...current.presentation,
                                      height: event.target
                                        .value as SiteImageHeight
                                    }
                                  }))
                                }
                                className='h-11 w-full rounded-[8px] border border-olive/14 bg-porcelain px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
                              >
                                {Object.entries(imageHeightLabels).map(
                                  ([value, label]) => (
                                    <option key={value} value={value}>
                                      {label}
                                    </option>
                                  )
                                )}
                              </select>
                            </InputLabel>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}

function GuideStructureEditor ({
  content,
  onAddActivityGroup,
  onAddActivityLink,
  onAddGolfCourse,
  onAddInventoryGroup,
  onAddInventoryItem,
  onRemoveActivityGroup,
  onRemoveActivityLink,
  onRemoveGolfCourse,
  onRemoveInventoryGroup,
  onRemoveInventoryItem
}: {
  content: SiteCopy
  onAddActivityGroup: () => void
  onAddActivityLink: (groupIndex: number) => void
  onAddGolfCourse: () => void
  onAddInventoryGroup: () => void
  onAddInventoryItem: (groupIndex: number) => void
  onRemoveActivityGroup: (groupIndex: number) => void
  onRemoveActivityLink: (groupIndex: number, linkIndex: number) => void
  onRemoveGolfCourse: (courseIndex: number) => void
  onRemoveInventoryGroup: (groupIndex: number) => void
  onRemoveInventoryItem: (groupIndex: number, itemIndex: number) => void
}) {
  return (
    <div className='mt-8 border-t border-olive/10 pt-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h3 className='font-serif text-2xl text-olive'>
            Guide page list structure
          </h3>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-ink/62'>
            Add or remove golf courses, other activity links and inventory
            rows here. Edit wording, URLs and map queries in the text fields
            above.
          </p>
        </div>
      </div>

      <div className='mt-5 grid gap-5 xl:grid-cols-3'>
        <section className='rounded-[8px] border border-olive/10 bg-ivory p-5'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <p className='text-xs font-bold uppercase text-champagne'>
                Golf
              </p>
              <h4 className='mt-1 font-serif text-2xl text-olive'>
                Courses
              </h4>
            </div>
            <StructureButton
              icon={<Plus className='h-4 w-4' aria-hidden='true' />}
              onClick={onAddGolfCourse}
            >
              Add course
            </StructureButton>
          </div>

          <div className='mt-4 space-y-2'>
            {content.guestGuide.activities.golf.courses.map(
              (course, courseIndex) => (
                <div
                  className='flex items-center justify-between gap-3 rounded-[8px] bg-porcelain px-3 py-3'
                  key={`${course.title}-${courseIndex}`}
                >
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-olive'>
                      {course.title}
                    </p>
                    <p className='truncate text-xs text-ink/50'>
                      {course.href}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => onRemoveGolfCourse(courseIndex)}
                    className='shrink-0 rounded-full p-2 text-clay transition hover:bg-clay/10'
                    aria-label={`Remove ${course.title}`}
                  >
                    <Trash2 className='h-4 w-4' aria-hidden='true' />
                  </button>
                </div>
              )
            )}
          </div>
        </section>

        <section className='rounded-[8px] border border-olive/10 bg-ivory p-5'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <p className='text-xs font-bold uppercase text-champagne'>
                Other activities
              </p>
              <h4 className='mt-1 font-serif text-2xl text-olive'>
                Links and sections
              </h4>
            </div>
            <StructureButton
              icon={<Plus className='h-4 w-4' aria-hidden='true' />}
              onClick={onAddActivityGroup}
            >
              Add section
            </StructureButton>
          </div>

          <div className='mt-4 space-y-3'>
            {content.guestGuide.activities.other.groups.map(
              (group, groupIndex) => (
                <article
                  className='rounded-[8px] border border-olive/10 bg-porcelain p-4'
                  key={`activity-${groupIndex}`}
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='font-semibold text-olive'>{group.title}</p>
                      <p className='mt-1 text-xs text-ink/52'>
                        {group.links.length} links
                      </p>
                    </div>
                    <StructureButton
                      disabled={
                        content.guestGuide.activities.other.groups.length <= 1
                      }
                      icon={
                        <Trash2 className='h-4 w-4' aria-hidden='true' />
                      }
                      onClick={() => onRemoveActivityGroup(groupIndex)}
                      tone='danger'
                    >
                      Remove
                    </StructureButton>
                  </div>

                  <div className='mt-3 space-y-2'>
                    {group.links.map((link, linkIndex) => (
                      <div
                        className='flex items-center justify-between gap-3 rounded-[8px] bg-ivory px-3 py-2'
                        key={`${link.href}-${linkIndex}`}
                      >
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-semibold text-ink'>
                            {link.title}
                          </p>
                          <p className='truncate text-xs text-ink/50'>
                            {link.href}
                          </p>
                        </div>
                        <button
                          type='button'
                          onClick={() =>
                            onRemoveActivityLink(groupIndex, linkIndex)
                          }
                          className='shrink-0 rounded-full p-2 text-clay transition hover:bg-clay/10'
                          aria-label={`Remove ${link.title}`}
                        >
                          <Trash2 className='h-4 w-4' aria-hidden='true' />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type='button'
                    onClick={() => onAddActivityLink(groupIndex)}
                    className='mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-olive/15 px-4 text-sm font-bold text-olive transition hover:bg-ivory'
                  >
                    <Plus className='h-4 w-4' aria-hidden='true' />
                    Add link
                  </button>
                </article>
              )
            )}
          </div>
        </section>

        <section className='rounded-[8px] border border-olive/10 bg-ivory p-5'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <p className='text-xs font-bold uppercase text-champagne'>
                Inventory
              </p>
              <h4 className='mt-1 font-serif text-2xl text-olive'>
                Categories and items
              </h4>
            </div>
            <StructureButton
              icon={<Plus className='h-4 w-4' aria-hidden='true' />}
              onClick={onAddInventoryGroup}
            >
              Add category
            </StructureButton>
          </div>

          <div className='mt-4 space-y-3'>
            {content.guestGuide.inventory.groups.map((group, groupIndex) => (
              <article
                className='rounded-[8px] border border-olive/10 bg-porcelain p-4'
                key={`inventory-${groupIndex}`}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='font-semibold text-olive'>{group.title}</p>
                    <p className='mt-1 text-xs text-ink/52'>
                      {group.items.length} items
                    </p>
                  </div>
                  <StructureButton
                    disabled={content.guestGuide.inventory.groups.length <= 1}
                    icon={<Trash2 className='h-4 w-4' aria-hidden='true' />}
                    onClick={() => onRemoveInventoryGroup(groupIndex)}
                    tone='danger'
                  >
                    Remove
                  </StructureButton>
                </div>

                <div className='mt-3 flex flex-wrap gap-2'>
                  {group.items.map((item, itemIndex) => (
                    <button
                      type='button'
                      onClick={() => onRemoveInventoryItem(groupIndex, itemIndex)}
                      className='inline-flex max-w-full items-center gap-2 rounded-full bg-ivory px-3 py-2 text-xs font-semibold text-ink/70 transition hover:text-clay'
                      key={`${item}-${itemIndex}`}
                    >
                      <span className='truncate'>{item}</span>
                      <Trash2 className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
                    </button>
                  ))}
                </div>

                <button
                  type='button'
                  onClick={() => onAddInventoryItem(groupIndex)}
                  className='mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-olive/15 px-4 text-sm font-bold text-olive transition hover:bg-ivory'
                >
                  <Plus className='h-4 w-4' aria-hidden='true' />
                  Add item
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function StructureButton ({
  children,
  disabled,
  icon,
  onClick,
  tone = 'default'
}: {
  children: ReactNode
  disabled?: boolean
  icon: ReactNode
  onClick: () => void
  tone?: 'default' | 'danger'
}) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-45 ${
        tone === 'danger'
          ? 'border-clay/25 text-clay hover:bg-clay/10'
          : 'border-olive/15 text-olive hover:bg-porcelain'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function BookingsTab ({
  bookings,
  onUpdateBooking
}: {
  bookings: BookingRecord[]
  onUpdateBooking: (id: string, action: BookingAdminAction) => void
}) {
  return (
    <section className='mt-6 space-y-4'>
      {bookings.length === 0 ? (
        <p className='rounded-[8px] bg-porcelain p-6 text-sm text-ink/62 shadow-line'>
          No reservations yet.
        </p>
      ) : null}
      {bookings.map(booking => (
        <article
          className='rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line'
          key={booking.id}
        >
          <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
            <div>
              <div className='flex flex-wrap items-center gap-3'>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    statusClasses[booking.status]
                  }`}
                >
                  {statusLabels[booking.status]}
                </span>
                <span className='text-sm text-ink/50'>{booking.reference}</span>
              </div>
              <h2 className='mt-4 font-serif text-3xl text-olive'>
                {booking.name}
              </h2>
              <p className='mt-2 text-sm text-ink/62'>{booking.email}</p>
              <p className='mt-3 text-sm font-semibold text-ink'>
                {booking.arrivalDate} - {booking.departureDate} /{' '}
                {booking.nights} nights / {booking.guests} guests
              </p>
              <p className='mt-2 text-sm text-ink/62'>
                {booking.bookingType.replace('_', ' ')} /{' '}
                {formatDkk(booking.estimatedPriceDkk)}
              </p>
              {booking.message ? (
                <p className='mt-4 max-w-3xl text-sm leading-6 text-ink/68'>
                  {booking.message}
                </p>
              ) : null}
            </div>
            <div className='flex flex-wrap gap-2'>
              <ActionButton
                disabled={booking.status === 'booked'}
                icon={<Check className='h-4 w-4' aria-hidden='true' />}
                label='Approve'
                onClick={() => onUpdateBooking(booking.id, 'approve')}
              />
              <ActionButton
                disabled={
                  booking.status === 'denied' || booking.status === 'cancelled'
                }
                icon={<X className='h-4 w-4' aria-hidden='true' />}
                label='Deny'
                onClick={() => onUpdateBooking(booking.id, 'deny')}
              />
              <ActionButton
                disabled={booking.status === 'cancelled'}
                icon={<Trash2 className='h-4 w-4' aria-hidden='true' />}
                label='Cancel'
                onClick={() => onUpdateBooking(booking.id, 'cancel')}
              />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

function CodesTab ({
  accessCodes,
  newCodeKind,
  newCodeLabel,
  newCodeValue,
  onCreateCode,
  onDeleteCode,
  onNewCodeKindChange,
  onNewCodeLabelChange,
  onNewCodeValueChange
}: {
  accessCodes: AccessCodeListItem[]
  newCodeKind: 'friend' | 'family'
  newCodeLabel: string
  newCodeValue: string
  onCreateCode: (event: FormEvent<HTMLFormElement>) => void
  onDeleteCode: (id: string) => void
  onNewCodeKindChange: (kind: 'friend' | 'family') => void
  onNewCodeLabelChange: (value: string) => void
  onNewCodeValueChange: (value: string) => void
}) {
  return (
    <section className='mt-6 grid gap-6 lg:grid-cols-[0.76fr_1fr]'>
      <form
        onSubmit={onCreateCode}
        className='rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line'
      >
        <div className='flex h-11 w-11 items-center justify-center rounded-full bg-olive text-ivory'>
          <KeyRound className='h-5 w-5' aria-hidden='true' />
        </div>
        <h2 className='mt-5 font-serif text-3xl text-olive'>
          Create private code
        </h2>
        <p className='mt-2 text-sm leading-6 text-ink/62'>
          Friend codes reserve dates while payment is handled directly. Family
          codes book dates immediately. Guests do not see this difference.
        </p>
        <div className='mt-5 grid gap-4'>
          <InputLabel label='Name'>
            <input
              required
              value={newCodeLabel}
              onChange={event => onNewCodeLabelChange(event.target.value)}
              placeholder='Summer friends 2026'
              className='h-11 w-full rounded-[8px] border border-olive/14 bg-ivory px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
            />
          </InputLabel>
          <InputLabel label='Type'>
            <select
              value={newCodeKind}
              onChange={event =>
                onNewCodeKindChange(event.target.value as 'friend' | 'family')
              }
              className='h-11 w-full rounded-[8px] border border-olive/14 bg-ivory px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
            >
              <option value='friend'>Friend code</option>
              <option value='family'>Family code</option>
            </select>
          </InputLabel>
          <InputLabel label='Code'>
            <input
              required
              value={newCodeValue}
              onChange={event => onNewCodeValueChange(event.target.value)}
              placeholder='Choose a private code'
              className='h-11 w-full rounded-[8px] border border-olive/14 bg-ivory px-3 text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30'
            />
          </InputLabel>
        </div>
        <button className='mt-6 h-11 rounded-full bg-olive px-5 text-sm font-bold text-ivory'>
          Create code
        </button>
      </form>

      <div className='rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line'>
        <h2 className='font-serif text-3xl text-olive'>Active codes</h2>
        <div className='mt-5 space-y-3'>
          {accessCodes.length === 0 ? (
            <p className='rounded-[8px] bg-ivory p-4 text-sm text-ink/62'>
              No codes yet.
            </p>
          ) : null}
          {accessCodes.map(accessCode => (
            <div
              key={accessCode.id}
              className='flex flex-col gap-3 rounded-[8px] border border-olive/10 bg-ivory p-4 sm:flex-row sm:items-center sm:justify-between'
            >
              <div>
                <p className='font-semibold text-olive'>{accessCode.label}</p>
                <p className='mt-1 text-sm text-ink/58'>
                  {accessCode.kind === 'family' ? 'Family' : 'Friend'} /{' '}
                  {accessCode.codePreview}
                </p>
              </div>
              <button
                type='button'
                onClick={() => onDeleteCode(accessCode.id)}
                className='inline-flex h-10 items-center justify-center gap-2 rounded-full border border-clay/25 px-4 text-sm font-bold text-clay'
              >
                <Trash2 className='h-4 w-4' aria-hidden='true' />
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Metric ({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line'>
      <p className='text-sm text-ink/55'>{label}</p>
      <p className='mt-2 font-serif text-4xl text-olive'>{value}</p>
    </div>
  )
}

function TabButton ({
  active,
  children,
  onClick
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold ${
        active
          ? 'border-champagne text-olive'
          : 'border-transparent text-ink/52'
      }`}
    >
      {children}
    </button>
  )
}

function LanguageButton ({
  active,
  children,
  onClick
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`h-11 rounded-full px-4 text-sm font-bold ${
        active ? 'bg-olive text-ivory' : 'border border-olive/15 text-olive'
      }`}
    >
      {children}
    </button>
  )
}

function SaveButton ({
  children,
  disabled,
  onClick
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className='inline-flex h-11 items-center justify-center gap-2 rounded-full bg-olive px-5 text-sm font-bold text-ivory disabled:opacity-60'
    >
      <Save className='h-4 w-4' aria-hidden='true' />
      {children}
    </button>
  )
}

function ActionButton ({
  disabled,
  icon,
  label,
  onClick
}: {
  disabled?: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className='inline-flex h-10 items-center gap-2 rounded-full border border-olive/15 px-4 text-sm font-bold text-olive transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-45'
    >
      {icon}
      {label}
    </button>
  )
}

function InputLabel ({
  children,
  label
}: {
  children: ReactNode
  label: string
}) {
  return (
    <label className='mt-4 block first:mt-0'>
      <span className='mb-2 block text-xs font-bold uppercase text-ink/48'>
        {label}
      </span>
      {children}
    </label>
  )
}
