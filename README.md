# Casa Mimosa

Casa Mimosa is a production-ready private luxury villa rental website for a villa in Sierrazuela, Fuengirola / Mijas, Spain. It is built as a bilingual Danish/English Next.js App Router project with server-side family access validation, season-based guide pricing, and a manual booking request flow.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- React Server Components where practical
- lucide-react icons
- framer-motion for subtle motion
- date-fns for date handling
- zod for API validation

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
FAMILY_ACCESS_CODE=Crossfire
OWNER_EMAIL=your-email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Optional future email integration:

```bash
RESEND_API_KEY=
```

`FAMILY_ACCESS_CODE` is never exposed to the browser. The family flow posts the submitted code to `/api/validate-family-code`, where the value is compared on the server. A valid code sets an HttpOnly cookie used by `/api/booking-request` to verify family reservations.

## Deployment: Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add production environment variables:
   - `FAMILY_ACCESS_CODE`
   - `OWNER_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`
   - optional `RESEND_API_KEY`
4. Deploy.

Vercel will use `npm run build` automatically.

## Deployment: Render

Use a Render Web Service with:

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Environment: Node

Set the same environment variables as Vercel. Render must provide a Node version compatible with Next.js 16.

## Editing Content

- Bilingual copy: `lib/i18n.ts`
- Gallery placeholder images: `lib/i18n.ts`, `galleryImages`
- Season pricing: `lib/pricing.ts`
- Booking validation: `lib/validation.ts`
- Booking request route: `app/api/booking-request/route.ts`
- Family code route: `app/api/validate-family-code/route.ts`

## Pricing

Guide prices are currently:

- Low season: from EUR 350/day
- Mid season: from EUR 475/day
- High season: from EUR 650/day
- Peak season: from EUR 800/day

Final bookings are intentionally manual. Public visitors can only submit a booking request. Family access sets the estimated price to EUR 0 and marks the submission as a private family reservation, but it still creates a request rather than a payment transaction.

## Still To Customize

- Replace Unsplash placeholders with real Casa Mimosa photography.
- Confirm real pricing and season boundaries.
- Set the real owner email in production.
- Add production email sending in `app/api/booking-request/route.ts`, for example with Resend.
- Replace `FAMILY_ACCESS_CODE` with the final private code before sharing broadly.
