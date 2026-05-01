import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const sans = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Casa Mimosa | Private Villa in Fuengirola / Mijas",
  description:
    "A private luxury villa in Sierrazuela, Fuengirola / Mijas with sea views, pool, rooftop terrace, tropical garden and designer interior.",
  openGraph: {
    title: "Casa Mimosa | Private Villa in Fuengirola / Mijas",
    description:
      "A private luxury villa in Sierrazuela, Fuengirola / Mijas with sea views, pool, rooftop terrace, tropical garden and designer interior.",
    url: siteUrl,
    siteName: "Casa Mimosa",
    images: [
      {
        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
        width: 1600,
        height: 1067,
        alt: "Mediterranean private villa with pool and garden",
      },
    ],
    locale: "da_DK",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Mimosa | Private Villa in Fuengirola / Mijas",
    description:
      "A private luxury villa in Sierrazuela, Fuengirola / Mijas with sea views, pool, rooftop terrace, tropical garden and designer interior.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
