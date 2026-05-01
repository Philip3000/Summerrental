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
      booking: "Forespørgsel",
    },
    hero: {
      eyebrow: "Privat villa i Sierrazuela",
      title: "Casa Mimosa",
      location: "Sierrazuela, Fuengirola / Mijas",
      tagline:
        "En privat villa over kysten - tropisk ro, havudsigt og skandinavisk elegance.",
      primaryCta: "Se ledighed",
      familyCta: "Familieadgang",
      statOne: "4 soveværelser",
      statTwo: "3 badeværelser",
      statThree: "Op til 8 gæster",
    },
    overview: {
      eyebrow: "Villaen",
      title: "Skabt til langsomme morgener, lange middage og private dage ved poolen.",
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
      eyebrow: "Atmosfaere",
      title: "Tropisk udenfor. Roligt, luksuriøst og personligt indenfor.",
      paragraphs: [
        "Casa Mimosa skal føles som et privat hjem, ikke som et hotel. Der er plads til badetøj, barfodede aftener og store middage, men også til rolige hjørnesofaer, smukke materialer og et interiør der ikke råber.",
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
        ["Nær stranden", "Kysten er inden for behagelig rækkevidde."],
        ["Familievenlig", "Skabt til private ophold med op til 8 gæster."],
        ["Rolig beliggenhed", "Sierrazuela giver luft, udsigt og diskretion."],
      ],
    },
    location: {
      eyebrow: "Beliggenhed",
      title: "Sierrazuela: roligt, grønt og tæt på Costa del Sol.",
      body:
        "Villaen ligger i Sierrazuela ved Fuengirola / Mijas, et beboelsesområde med mere ro end kystens travleste adresser. Herfra er der nem adgang til strand, restauranter, golf, dagsture i Andalusien og Malaga lufthavn.",
      notes: [
        "Roligt villaområde med privat karakter",
        "Tæt på Fuengirola, Mijas og kysten",
        "God base for stranddage, golf og udflugter",
      ],
    },
    pricing: {
      eyebrow: "Priser",
      title: "Sæsonbaserede guidepriser.",
      body:
        "Priserne er vejledende EUR pr. dag. Endelige datoer, ophold og vilkår bekræftes altid manuelt af ejeren.",
      from: "fra",
      perDay: "dag",
      note: "Familie- og venneophold kan reserveres privat med gyldig adgangskode.",
    },
    booking: {
      eyebrow: "Forespørgsel",
      title: "Send en rolig forespørgsel - ingen offentlig instant booking.",
      body:
        "Vælg datoer og antal gæster for et vejledende estimat. Almindelige forespørgsler bekræftes manuelt, mens familieadgang markerer opholdet som en privat reservation.",
      arrival: "Ankomst",
      departure: "Afrejse",
      guests: "Gæster",
      name: "Navn",
      email: "Email",
      message: "Besked",
      messagePlaceholder: "Fortæl kort hvem der kommer, og om der er særlige ønsker.",
      estimate: "Estimat",
      nights: "nætter",
      night: "nat",
      included: "Privat familieophold",
      request: "Send forespørgsel",
      reserve: "Reserver privat",
      guide: "Vejledende pris",
      successTitle: "Forespørgslen er sendt",
      successBody:
        "Tak. Din forespørgsel er modtaget og bliver bekræftet personligt.",
      error: "Noget gik galt. Prøv igen om lidt.",
      rangeError: "Vælg en afrejsedato efter ankomstdatoen.",
      familyUnlocked: "Familieadgang aktiv - pris sat til EUR 0.",
    },
    family: {
      title: "Familieadgang",
      body:
        "Indtast den private kode for at markere opholdet som en familie- eller vennereservation.",
      label: "Privat kode",
      submit: "Luk op",
      success: "Familieadgang aktiveret.",
      error: "Koden kunne ikke valideres.",
      close: "Luk",
    },
    footer: {
      title: "Casa Mimosa",
      body:
        "En privat villa i Sierrazuela for familie, nære venner og udvalgte gæster.",
      booking: "Forespørg om ophold",
      family: "Familieadgang",
    },
  },
  en: {
    nav: {
      villa: "Villa",
      gallery: "Gallery",
      amenities: "Amenities",
      location: "Location",
      pricing: "Pricing",
      booking: "Request",
    },
    hero: {
      eyebrow: "Private villa in Sierrazuela",
      title: "Casa Mimosa",
      location: "Sierrazuela, Fuengirola / Mijas",
      tagline:
        "A private villa above the coast - tropical calm, sea views and Scandinavian elegance.",
      primaryCta: "Check availability",
      familyCta: "Family access",
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
        "Casa Mimosa should feel like a private home, not a hotel. There is room for swimsuits, barefoot evenings and generous dinners, but also quiet sofas, beautiful materials and interiors that never shout.",
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
        ["Close to beach", "The coast is within easy reach."],
        ["Family-friendly", "Made for private stays with up to 8 guests."],
        ["Quiet Sierrazuela", "Sierrazuela gives space, views and discretion."],
      ],
    },
    location: {
      eyebrow: "Location",
      title: "Sierrazuela: calm, green and close to the Costa del Sol.",
      body:
        "The villa is in Sierrazuela by Fuengirola / Mijas, a residential area with more calm than the busiest coastal addresses. From here there is easy access to beaches, restaurants, golf, Andalusian day trips and Malaga airport.",
      notes: [
        "Quiet villa area with a private character",
        "Close to Fuengirola, Mijas and the coast",
        "A strong base for beach days, golf and exploring",
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Season-based guide pricing.",
      body:
        "Prices are indicative EUR per day. Final dates, stays and terms are always confirmed manually by the owner.",
      from: "from",
      perDay: "day",
      note: "Family and close friend stays can be reserved privately with valid access.",
    },
    booking: {
      eyebrow: "Request",
      title: "Send a calm request - no public instant booking.",
      body:
        "Choose dates and guests for a guide estimate. Public requests are confirmed manually, while family access marks the stay as a private reservation.",
      arrival: "Arrival",
      departure: "Departure",
      guests: "Guests",
      name: "Name",
      email: "Email",
      message: "Message",
      messagePlaceholder: "Tell us briefly who is coming and whether you have any wishes.",
      estimate: "Estimate",
      nights: "nights",
      night: "night",
      included: "Private family stay",
      request: "Request booking",
      reserve: "Reserve privately",
      guide: "Guide price",
      successTitle: "Request sent",
      successBody:
        "Thank you. Your request has been received and will be confirmed personally.",
      error: "Something went wrong. Please try again shortly.",
      rangeError: "Choose a departure date after the arrival date.",
      familyUnlocked: "Family access active - price set to EUR 0.",
    },
    family: {
      title: "Family access",
      body:
        "Enter the private code to mark the stay as a family or close friends reservation.",
      label: "Private code",
      submit: "Unlock",
      success: "Family access unlocked.",
      error: "The code could not be validated.",
      close: "Close",
    },
    footer: {
      title: "Casa Mimosa",
      body:
        "A private villa in Sierrazuela for family, close friends and selected guests.",
      booking: "Request a stay",
      family: "Family access",
    },
  },
} as const;

export type SiteCopy = (typeof copy)[Language];

export function getCopy(language: Language): SiteCopy {
  return copy[language];
}
