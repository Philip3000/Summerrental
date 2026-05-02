export type Language = "da" | "en";

export const languages: { code: Language; label: string }[] = [
  { code: "da", label: "DA" },
  { code: "en", label: "EN" },
];

export const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=85",
    alt: {
      da: "Privat middelhavsvilla med pool og have",
      en: "Private Mediterranean villa with pool and garden",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    alt: {
      da: "Lyst designerinteriør med rolige naturmaterialer",
      en: "Bright designer interior with calm natural materials",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    alt: {
      da: "Elegant opholdsrum med udsigt og varme toner",
      en: "Elegant living space with views and warm tones",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    alt: {
      da: "Raffineret villaarkitektur omgivet af grønne omgivelser",
      en: "Refined villa architecture surrounded by greenery",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
    alt: {
      da: "Kyst og havlys ved Costa del Sol",
      en: "Coastline and sea light on Costa del Sol",
    },
  },
];

export const copy = {
  da: {
    nav: {
      villa: "Villa",
      gallery: "Galleri",
      amenities: "Faciliteter",
      location: "Området",
      pricing: "Priser",
      booking: "Ophold",
    },
    hero: {
      eyebrow: "Privat villa i Sierrazuela",
      title: "Casa Mimosa",
      location: "Fuengirola / Mijas",
      tagline: "En privat villa ved kysten - ro, havudsigt og skandinavisk elegance.",
      primaryCta: "Se ledighed",
      secondaryCta: "Oplev villaen",
      statOne: "4 soveværelser",
      statTwo: "3 badeværelser",
      statThree: "Op til 8 gæster",
    },
    overview: {
      eyebrow: "Villaen",
      title: "Nyd langsomme morgener, lange middage og private dage ved poolen.",
      body:
        "Casa Mimosa er et personligt hjem i Spanien med plads til familie, nære venner og udvalgte gæster. Udtrykket er varmt og roligt: tropisk have og middelhavsliv udenfor, designerinteriør og semi-nordisk lethed indenfor.",
      items: [
        { value: "4", label: "soveværelser" },
        { value: "3", label: "badeværelser" },
        { value: "8", label: "maks. gæster" },
        { value: "360", label: "grønt omkring poolen" },
      ],
      features: [
        "Havudsigt fra villa og terrasse",
        "Privat pool og tropisk have",
        "Rooftop-terrasse til solnedgang",
        "Designerinteriør med semi-nordisk ro",
      ],
    },
    experience: {
      eyebrow: "Atmosfære",
      title: "Tropisk udenfor. Roligt, luksuriøst og personligt indenfor.",
      paragraphs: [
        "Casa Mimosa føles som et privat hjem, ikke som et hotel. Her er plads til badetøj, barfodede aftener og lange middage, men også til rolige hjørner, smukke materialer og et interiør der ikke behøver at imponere højt.",
        "Udenfor er stemningen grøn og varm med pool, palmer og havefornemmelse. Indenfor er den mere tilbageholdt: lyse flader, designerobjekter, naturlige teksturer og en behagelig skandinavisk balance.",
      ],
      details: [
        "Middelhavsliv med privat afstand",
        "Tropisk have omkring poolen",
        "Stille luksus frem for resort-fornemmelse",
      ],
    },
    gallery: {
      eyebrow: "Galleri",
      title: "Et visuelt udgangspunkt - klar til de rigtige Casa Mimosa fotos.",
      body:
        "Billederne er elegante Unsplash-pladsholdere, valgt for lys, materialer og stemning. De kan udskiftes direkte med villaens egne fotos uden at ændre layoutet.",
    },
    amenities: {
      eyebrow: "Highlights",
      title: "Alt det vigtige, pakket ind i en privat og uformel ramme.",
      items: [
        ["Havudsigt", "Udsigt over kysten og det sydlige lys."],
        ["Privat pool", "Et roligt poolområde kun for huset."],
        ["Rooftop-terrasse", "Et naturligt sted til solnedgang og aperitif."],
        ["Tropisk have", "Grøn, varm og afskærmet atmosfære."],
        ["Designerinteriør", "Semi-nordisk stil med varme materialer."],
        ["4 soveværelser", "God plads til familie og nære venner."],
        ["3 badeværelser", "Komfortabelt for op til otte gæster."],
        ["Nær stranden", "Stranden er inden for 4 minutters kørsel."],
        ["Familievenlig", "Til private ophold med op til 8 gæster."],
        ["Rolig beliggenhed", "Sierrazuela giver luft, udsigt og diskretion."],
      ],
    },
    location: {
      eyebrow: "Beliggenhed",
      title: "Sierrazuela: roligt, grønt og tæt på Costa del Sol.",
      body:
        "Villaen ligger i Sierrazuela ved Fuengirola / Mijas, et beboelsesområde med mere ro end kystens travleste adresser. Herfra er der nem adgang til strand, restauranter, golf, dagsture i Andalusien og Málaga lufthavn.",
      notes: [
        "Roligt villaområde med privat karakter",
        "Tæt på Fuengirola, Mijas og stranden",
        "God base for stranddage, golf og udflugter",
      ],
    },
    pricing: {
      eyebrow: "Priser",
      title: "Vejledende priser efter sæson.",
      body:
        "Priserne er angivet i DKK pr. dag og giver et enkelt overblik. Endelige datoer og praktiske detaljer aftales altid direkte.",
      from: "fra",
      perDay: "dag",
      note: "Har du en privat kode, kan den bruges diskret i formularen for ophold.",
    },
    booking: {
      eyebrow: "Ophold",
      title: "Reserver datoer på Casa Mimosa.",
      body:
        "Vælg datoer og antal gæster for at se ledighed og pris. Ophold håndteres personligt, så huset bevarer sin private karakter.",
      arrival: "Ankomst",
      departure: "Afrejse",
      guests: "Gæster",
      name: "Navn",
      email: "Email",
      privateCode: "Bookingkode",
      privateCodePlaceholder: "Valgfri",
      privateCodeHelp: "Har du modtaget en kode, kan du skrive den her.",
      privateCodeError: "Koden kunne ikke bruges. Tjek den, eller send uden kode.",
      periodLabel: "Vælg periode",
      periodHelp: "Klik første dag og derefter sidste overnatningsdag.",
      previousMonth: "Forrige måned",
      nextMonth: "Næste måned",
      clearPeriod: "Ryd",
      availableLegend: "Ledig",
      selectedLegend: "Valgt",
      message: "Besked",
      messagePlaceholder: "Fortæl kort hvem der kommer, og om der er særlige ønsker.",
      estimate: "Pris",
      nights: "nætter",
      night: "nat",
      request: "Reserver datoer",
      guide: "Vejledende pris",
      availableStatus: "Valgte datoer er ledige.",
      unavailableStatus: "Valgte datoer er ikke ledige.",
      unavailableError: "Datoerne er allerede reserveret eller booket.",
      calendarTitle: "Optagede perioder",
      reservedLabel: "Reserveret",
      bookedLabel: "Booket",
      successTitle: "Modtaget",
      successBody: "Tak. Vi har modtaget dine datoer og vender tilbage personligt.",
      reservedBody: "Datoerne er registreret. Du får en personlig opfølgning.",
      error: "Noget gik galt. Prøv igen om lidt.",
      rangeError: "Vælg en afrejsedato efter ankomstdatoen.",
    },
    footer: {
      title: "Casa Mimosa",
      body: "En privat villa i Sierrazuela for familie, nære venner og udvalgte gæster.",
      booking: "Reserver datoer",
    },
  },
  en: {
    nav: {
      villa: "Villa",
      gallery: "Gallery",
      amenities: "Amenities",
      location: "Location",
      pricing: "Pricing",
      booking: "Stays",
    },
    hero: {
      eyebrow: "Private villa in Sierrazuela",
      title: "Casa Mimosa",
      location: "Fuengirola / Mijas",
      tagline: "A private villa by the coast - calm, sea views and Scandinavian elegance.",
      primaryCta: "Check availability",
      secondaryCta: "Explore the villa",
      statOne: "4 bedrooms",
      statTwo: "3 bathrooms",
      statThree: "Up to 8 guests",
    },
    overview: {
      eyebrow: "The villa",
      title: "Made for slow mornings, long dinners and private days by the pool.",
      body:
        "Casa Mimosa is a personal home in Spain for family, close friends and selected guests. The mood is warm and calm: tropical garden and Mediterranean living outside, designer interiors and semi-Nordic restraint inside.",
      items: [
        { value: "4", label: "bedrooms" },
        { value: "3", label: "bathrooms" },
        { value: "8", label: "max guests" },
        { value: "360", label: "green degrees around the pool" },
      ],
      features: [
        "Sea views from the villa and terraces",
        "Private pool and tropical garden",
        "Rooftop terrace for sunset",
        "Designer interior with semi-Nordic calm",
      ],
    },
    experience: {
      eyebrow: "Atmosphere",
      title: "Tropical outside. Calm, luxurious and personal inside.",
      paragraphs: [
        "Casa Mimosa feels like a private home, not a hotel. There is room for swimsuits, barefoot evenings and generous dinners, but also quiet corners, beautiful materials and interiors that do not need to announce themselves loudly.",
        "Outside, the feeling is green and warm with pool, palms and garden calm. Inside, the atmosphere is more restrained: light surfaces, designer objects, natural textures and a soft Scandinavian balance.",
      ],
      details: [
        "Mediterranean living with private distance",
        "Tropical garden around the pool",
        "Quiet luxury rather than resort energy",
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      title: "A visual starting point - ready for real Casa Mimosa photography.",
      body:
        "These are elegant Unsplash placeholders selected for light, materials and atmosphere. They can be replaced directly with the villa's own photography without changing the layout.",
    },
    amenities: {
      eyebrow: "Highlights",
      title: "The essentials, wrapped in a private and easygoing setting.",
      items: [
        ["Sea view", "Views across the coast and southern light."],
        ["Private pool", "A calm pool area reserved for the house."],
        ["Rooftop terrace", "A natural place for sunset and aperitif."],
        ["Tropical garden", "Green, warm and quietly screened."],
        ["Designer interior", "Semi-Nordic style with warm materials."],
        ["4 bedrooms", "Generous space for family and close friends."],
        ["3 bathrooms", "Comfortable for up to eight guests."],
        ["Close to beach", "The beach is within a 4-minute drive."],
        ["Family-friendly", "Made for private stays with up to 8 guests."],
        ["Quiet Sierrazuela", "Sierrazuela gives space, views and discretion."],
      ],
    },
    location: {
      eyebrow: "Location",
      title: "Sierrazuela: calm, green and close to the Costa del Sol.",
      body:
        "The villa is in Sierrazuela by Fuengirola / Mijas, a residential area with more calm than the busiest coastal addresses. From here there is easy access to beaches, restaurants, golf, Andalusian day trips and Málaga airport.",
      notes: [
        "Quiet villa area with a private character",
        "Close to Fuengirola, Mijas and the beach",
        "A strong base for beach days, golf and exploring",
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Indicative seasonal pricing.",
      body:
        "Prices are shown in DKK per day as a simple guide. Final dates and practical details are always handled directly.",
      from: "from",
      perDay: "day",
      note: "If you have a private code, you can add it discreetly in the stay form.",
    },
    booking: {
      eyebrow: "Stay",
      title: "Reserve dates at Casa Mimosa.",
      body:
        "Choose dates and guests to see availability and pricing. Stays are handled personally so the house keeps its private character.",
      arrival: "Arrival",
      departure: "Departure",
      guests: "Guests",
      name: "Name",
      email: "Email",
      privateCode: "Private code",
      privateCodePlaceholder: "Optional",
      privateCodeHelp: "If you have received a code, you can enter it here.",
      privateCodeError: "The code could not be used. Check it, or send without a code.",
      periodLabel: "Choose period",
      periodHelp: "Click the first day, then the final overnight date.",
      previousMonth: "Previous month",
      nextMonth: "Next month",
      clearPeriod: "Clear",
      availableLegend: "Available",
      selectedLegend: "Selected",
      message: "Message",
      messagePlaceholder: "Tell us briefly who is coming and whether you have any wishes.",
      estimate: "Price",
      nights: "nights",
      night: "night",
      request: "Reserve dates",
      guide: "Guide price",
      availableStatus: "Selected dates are available.",
      unavailableStatus: "Selected dates are not available.",
      unavailableError: "Those dates are already reserved or booked.",
      calendarTitle: "Unavailable periods",
      reservedLabel: "Reserved",
      bookedLabel: "Booked",
      successTitle: "Received",
      successBody: "Thank you. We have received your dates and will follow up personally.",
      reservedBody: "The dates have been registered. You will receive a personal follow-up.",
      error: "Something went wrong. Please try again shortly.",
      rangeError: "Choose a departure date after the arrival date.",
    },
    footer: {
      title: "Casa Mimosa",
      body: "A private villa in Sierrazuela for family, close friends and selected guests.",
      booking: "Reserve dates",
    },
  },
} as const;

type DeepEditable<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends readonly (infer Item)[]
      ? DeepEditable<Item>[]
      : T extends object
        ? { -readonly [Key in keyof T]: DeepEditable<T[Key]> }
        : T;

export type SiteCopy = DeepEditable<(typeof copy)["da"]>;
export type SiteCopyByLanguage = Record<Language, SiteCopy>;

export function getCopy(language: Language): SiteCopy {
  return copy[language] as unknown as SiteCopy;
}
