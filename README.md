# Casa Mimosa

Casa Mimosa is a production-ready private villa booking site for one luxury villa in Sierrazuela, Fuengirola / Mijas, Spain. It includes bilingual public pages, DKK season pricing, direct date reservation with private codes, Firestore-backed booking storage, and an owner-friendly `/admin` terminal.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Firebase Web SDK for Auth, Firestore, and Storage
- lucide-react icons
- framer-motion for subtle motion
- date-fns for date handling
- zod for validation

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Admin terminal: `http://localhost:3000/admin`

Admin login uses Firebase Auth email/password. Enable Email/Password sign-in in Firebase Authentication, create an owner user, then create a Firestore document at `admins/{firebaseAuthUid}`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

Public Firebase config is included because Firebase web config is not a secret:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=casamimosa-a5aa6.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=casamimosa-a5aa6
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=casamimosa-a5aa6.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=137963519885
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Server-side/private configuration:

```bash
OWNER_EMAIL=martin@safeyou.dk
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

No Firebase Admin SDK, service account private key, server-writer account, or custom admin session secret is required. The admin dashboard uses the signed-in Firebase Auth user directly, and Firestore/Storage rules authorize writes through `admins/{uid}`.

Create and remove active friend/family codes in `/admin`; those codes are stored in Firestore as SHA-256 hashes.

## Booking Logic

- Public booking uses a calendar period selector rather than separate date inputs.
- The calendar shows blocked dates with color coding: reserved and booked periods are visually distinct.
- No code: creates an `inquiry`; dates are not blocked.
- Friend code: creates a `reserved` booking; dates are blocked until admin approves, denies, or cancels.
- Family code: creates a `booked` reservation immediately; dates are blocked instantly.
- Admin approve: changes `reserved` or `inquiry` to `booked`.
- Admin deny or cancel: releases the dates.

Codes are managed in `/admin` and stored in Firestore as SHA-256 hashes, not plaintext. The public UI does not reveal that family and friend codes behave differently.

## Admin Terminal

`/admin` lets an authenticated owner:

- View all reservations and inquiries.
- See active reserved/booked date blocks.
- Approve, deny, or cancel bookings.
- Create or delete friend/family access codes.
- Edit all frontpage text in Danish and English.
- Edit seasonal DKK pricing and the months assigned to each season.
- Upload or paste image URLs for hero, gallery, location, and interior images.
- Adjust image crop focus, section image size, and gallery layout presets.
- Save site-wide frontpage content to Firestore.

## Firebase Rules

This repo includes:

- `firestore.rules`
- `storage.rules`
- `firebase.json`

Deploy rules with the Firebase CLI:

```bash
firebase deploy --only firestore:rules,storage
```

The rules allow admin access only when the signed-in Firebase Auth user has a matching Firestore document at `admins/{uid}`. The admin page uses normal Firebase client SDK calls such as `setDoc`, `updateDoc`, `deleteDoc`, and Storage uploads.

Recommended Firebase setup:

1. Enable Email/Password in Firebase Authentication.
2. Create an owner/admin Auth user.
3. Create `admins/{ownerUid}` in Firestore.
4. Deploy `firestore.rules` and `storage.rules`.

## Pricing

Guide prices are shown in DKK:

- Low season: from DKK 2,600/day
- Mid season: from DKK 3,500/day
- High season: from DKK 4,850/day
- Peak season: from DKK 6,000/day

Change prices and season boundaries in `lib/pricing.ts`.

## Deployment: Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add the public Firebase env vars, `NEXT_PUBLIC_SITE_URL`, and `OWNER_EMAIL`.
4. Deploy.

Vercel will use `npm run build`.

## Deployment: Render

Use a Render Web Service with:

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Environment: Node

Set the same environment variables as Vercel.

## Editing Content

- Bilingual copy: `lib/i18n.ts`
- Default image slots: `lib/siteContent.ts`
- Season pricing: `lib/pricing.ts`
- Live frontpage content in production: `/admin`, saved to Firestore `siteContent/main`
- Booking storage and site content storage: `lib/bookingStore.ts`
- Public booking API: `app/api/booking-request/route.ts`

## Hydration Note

The reported `data-lastpass-icon-root` hydration warning is caused by the LastPass browser extension injecting DOM into form fields before React hydrates. The app now avoids date-based client/server drift by passing today’s date from the server into the client booking component, but extension-injected DOM can still trigger that browser-only warning.

## Still To Customize

- Replace placeholder images with real Casa Mimosa photos via `/admin`.
- Confirm real prices, season month assignments, and all frontpage copy via `/admin`.
- Set final admin users in Firebase Auth and create production friend/family codes in `/admin`.
- Add production email notifications in `app/api/booking-request/route.ts` if desired.
