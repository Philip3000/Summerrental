"use client";

import { useEffect, useState } from "react";
import Amenities from "@/components/Amenities";
import BookingSection from "@/components/BookingSection";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import GuestGuideTeasers from "@/components/GuestGuideTeasers";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LocationSection from "@/components/LocationSection";
import Pricing from "@/components/Pricing";
import VillaOverview from "@/components/VillaOverview";
import type { Language } from "@/lib/i18n";
import type { SiteContent } from "@/types/site";

type CasaMimosaAppProps = {
  siteContent: SiteContent;
  today: string;
};

export default function CasaMimosaApp({ siteContent, today }: CasaMimosaAppProps) {
  const [language, setLanguage] = useState<Language>("da");
  const content = siteContent.copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <Header
        content={content}
        language={language}
        onLanguageChange={setLanguage}
      />
      <main>
        <Hero content={content} language={language} siteContent={siteContent} />
        <VillaOverview content={content} />
        <ExperienceSection content={content} language={language} siteContent={siteContent} />
        <Gallery content={content} language={language} siteContent={siteContent} />
        <Amenities content={content} />
        <LocationSection content={content} />
        <GuestGuideTeasers content={content} language={language} siteContent={siteContent} />
        <Pricing content={content} language={language} pricing={siteContent.pricing} />
        <BookingSection
          content={content}
          language={language}
          pricing={siteContent.pricing}
          today={today}
        />
      </main>
      <Footer content={content} language={language} />
    </>
  );
}
