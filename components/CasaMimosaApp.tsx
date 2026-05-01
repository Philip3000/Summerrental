"use client";

import { useEffect, useState } from "react";
import Amenities from "@/components/Amenities";
import BookingSection from "@/components/BookingSection";
import ExperienceSection from "@/components/ExperienceSection";
import FamilyAccess from "@/components/FamilyAccess";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LocationSection from "@/components/LocationSection";
import Pricing from "@/components/Pricing";
import VillaOverview from "@/components/VillaOverview";
import type { Language } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

export default function CasaMimosaApp() {
  const [language, setLanguage] = useState<Language>("da");
  const [familyAccessOpen, setFamilyAccessOpen] = useState(false);
  const [familyAccessUnlocked, setFamilyAccessUnlocked] = useState(false);
  const content = getCopy(language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <Header
        content={content}
        language={language}
        onFamilyAccessClick={() => setFamilyAccessOpen(true)}
        onLanguageChange={setLanguage}
      />
      <main>
        <Hero content={content} onFamilyAccessClick={() => setFamilyAccessOpen(true)} />
        <VillaOverview content={content} />
        <ExperienceSection content={content} />
        <Gallery content={content} language={language} />
        <Amenities content={content} />
        <LocationSection content={content} />
        <Pricing content={content} language={language} />
        <BookingSection
          content={content}
          familyAccessUnlocked={familyAccessUnlocked}
          language={language}
        />
      </main>
      <Footer content={content} onFamilyAccessClick={() => setFamilyAccessOpen(true)} />
      <FamilyAccess
        content={content}
        open={familyAccessOpen}
        onClose={() => setFamilyAccessOpen(false)}
        onUnlocked={() => setFamilyAccessUnlocked(true)}
      />
    </>
  );
}
