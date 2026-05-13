import { guideCopy } from './guideContent'

export type Language = 'da' | 'en'

export const languages: { code: Language; label: string }[] = [
  { code: 'da', label: 'DA' },
  { code: 'en', label: 'EN' }
]

export const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=85',
    alt: {
      da: 'Privat middelhavsvilla med pool og have',
      en: 'Private Mediterranean villa with pool and garden'
    }
  },
  {
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
    alt: {
      da: 'Lyst designerinteriÃ¸r med rolige naturmaterialer',
      en: 'Bright designer interior with calm natural materials'
    }
  },
  {
    src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85',
    alt: {
      da: 'Elegant opholdsrum med udsigt og varme toner',
      en: 'Elegant living space with views and warm tones'
    }
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    alt: {
      da: 'Raffineret villaarkitektur omgivet af grÃ¸nne omgivelser',
      en: 'Refined villa architecture surrounded by greenery'
    }
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85',
    alt: {
      da: 'Kyst og havlys ved Costa del Sol',
      en: 'Coastline and sea light on Costa del Sol'
    }
  }
]

export const copy = {
  da: {
    nav: {
      villa: 'Villa',
      gallery: 'Galleri',
      amenities: 'Faciliteter',
      location: 'OmrÃ¥det',
      activities: 'Aktiviteter',
      inventory: 'Inventar',
      pricing: 'Priser',
      booking: 'Ophold'
    },
    hero: {
      eyebrow: 'Privat villa i Sierrazuela',
      title: 'Casa Mimosa',
      location: 'Fuengirola / Mijas',
      tagline:
        'En privat villa ved kysten - ro, havudsigt og skandinavisk elegance.',
      primaryCta: 'Se ledighed',
      secondaryCta: 'Oplev villaen',
      statOne: '4 sovevÃ¦relser',
      statTwo: '3 badevÃ¦relser',
      statThree: 'Op til 8 gÃ¦ster'
    },
    overview: {
      eyebrow: 'Villaen',
      title:
        'Nyd langsomme morgener, lange middage og private dage ved poolen.',
      body: 'Casa Mimosa er et personligt hjem i Spanien med plads til familie, nÃ¦re venner og udvalgte gÃ¦ster. Udtrykket er varmt og roligt: tropisk have og middelhavsliv udenfor, designerinteriÃ¸r og semi-nordisk lethed indenfor.',
      items: [
        { value: '4', label: 'sovevÃ¦relser' },
        { value: '3', label: 'badevÃ¦relser' },
        { value: '8', label: 'maks. gÃ¦ster' },
        { value: '360', label: 'grÃ¸nt omkring poolen' }
      ],
      features: [
        'Havudsigt fra villa og terrasse',
        'Privat pool og tropisk have',
        'Rooftop-terrasse til solnedgang',
        'DesignerinteriÃ¸r med semi-nordisk ro'
      ]
    },
    experience: {
      eyebrow: 'AtmosfÃ¦re',
      title: 'Tropisk udenfor. Roligt, luksuriÃ¸st og personligt indenfor.',
      paragraphs: [
        'Casa Mimosa fÃ¸les som et privat hjem, ikke som et hotel. Her er plads til badetÃ¸j, barfodede aftener og lange middage, men ogsÃ¥ til rolige hjÃ¸rner, smukke materialer og et interiÃ¸r der ikke behÃ¸ver at imponere hÃ¸jt.',
        'Udenfor er stemningen grÃ¸n og varm med pool, palmer og havefornemmelse. Indenfor er den mere tilbageholdt: lyse flader, designerobjekter, naturlige teksturer og en behagelig skandinavisk balance.'
      ],
      details: [
        'Middelhavsliv med privat afstand',
        'Tropisk have omkring poolen',
        'Stille luksus frem for resort-fornemmelse'
      ]
    },
    gallery: {
      eyebrow: 'Galleri',
      title: 'Et visuelt udgangspunkt - klar til de rigtige Casa Mimosa fotos.',
      body: 'Billederne er elegante Unsplash-pladsholdere, valgt for lys, materialer og stemning. De kan udskiftes direkte med villaens egne fotos uden at Ã¦ndre layoutet.'
    },
    amenities: {
      eyebrow: 'Highlights',
      title: 'Alt det vigtige, pakket ind i en privat og uformel ramme.',
      items: [
        {
          title: 'Havudsigt',
          description: 'Udsigt over kysten og det sydlige lys.'
        },
        {
          title: 'Privat pool',
          description: 'Et roligt poolomrÃ¥de kun for huset.'
        },
        {
          title: 'Rooftop-terrasse',
          description: 'Et naturligt sted til solnedgang og aperitif.'
        },
        {
          title: 'Tropisk have',
          description: 'GrÃ¸n, varm og afskÃ¦rmet atmosfÃ¦re.'
        },
        {
          title: 'DesignerinteriÃ¸r',
          description: 'Semi-nordisk stil med varme materialer.'
        },
        {
          title: '4 sovevÃ¦relser',
          description: 'God plads til familie og nÃ¦re venner.'
        },
        {
          title: '3 badevÃ¦relser',
          description: 'Komfortabelt for op til otte gÃ¦ster.'
        },
        {
          title: 'NÃ¦r stranden',
          description: 'Stranden er inden for 4 minutters kÃ¸rsel.'
        },
        {
          title: 'Familievenlig',
          description: 'Til private ophold med op til 8 gÃ¦ster.'
        },
        {
          title: 'Rolig beliggenhed',
          description: 'Sierrazuela giver luft, udsigt og diskretion.'
        }
      ]
    },
    location: {
      eyebrow: 'Beliggenhed',
      title: 'Sierrazuela: roligt, grÃ¸nt og tÃ¦t pÃ¥ Costa del Sol.',
      body: 'Villaen ligger i Sierrazuela ved Fuengirola / Mijas, et beboelsesomrÃ¥de med mere ro end kystens travleste adresser. Herfra er der nem adgang til strand, restauranter, golf, dagsture i Andalusien og MÃ¡laga lufthavn.',
      notes: [
        'Roligt villaomrÃ¥de med privat karakter',
        'TÃ¦t pÃ¥ Fuengirola, Mijas og stranden',
        'God base for stranddage, golf og aktiviteter'
      ],
      address: 'Calle Mimosa De Sierrezuela 16, Mijas',
      mapLabel: 'Placering',
      mapCta: 'Ã…bn i Google Maps',
      areaEyebrow: 'OmrÃ¥det',
      areaTitle: 'Det bedste af Costa del Sol inden for rÃ¦kkevidde.',
      areaItems: [
        {
          title: 'Strand og hav',
          description: 'Kysten, strandklubber og rolige morgenture langs vandet ligger naturligt i dagens rytme.'
        },
        {
          title: 'Middage ude',
          description: 'Fuengirola, Mijas og nÃ¦rliggende kystbyer giver adgang til alt fra afslappede tapas til mere raffinerede aftener.'
        },
        {
          title: 'Golf og dagsture',
          description: 'OmrÃ¥det er et stÃ¦rkt udgangspunkt for golf, hvide landsbyer, Marbella, MÃ¡laga og klassiske andalusiske dagsture.'
        },
        {
          title: 'Rolig base',
          description: 'Sierrazuela fÃ¸les privat og tilbagetrukket, men stadig tÃ¦t pÃ¥ det, man faktisk rejser til Costa del Sol for.'
        }
      ]
    },
    guestGuideTeaser: guideCopy.da.guestGuideTeaser,
    guestGuide: guideCopy.da.guestGuide,
    pricing: {
      eyebrow: 'Priser',
      title: 'Vejledende priser efter sÃ¦son.',
      body: 'Priserne er angivet i DKK pr. dag og giver et enkelt overblik. Endelige datoer og praktiske detaljer aftales altid direkte.',
      from: 'fra',
      perDay: 'dag',
      note: 'Har du en privat kode, kan den bruges diskret i formularen for ophold.'
    },
    booking: {
      eyebrow: 'Ophold',
      title: 'Reserver datoer pÃ¥ Casa Mimosa.',
      body: 'VÃ¦lg datoer og antal gÃ¦ster for at se ledighed og pris. Ophold hÃ¥ndteres personligt, sÃ¥ huset bevarer sin private karakter.',
      arrival: 'Ankomst',
      departure: 'Afrejse',
      guests: 'GÃ¦ster',
      name: 'Navn',
      email: 'Email',
      privateCode: 'Bookingkode',
      privateCodePlaceholder: 'Skriv din bookingkode',
      privateCodeHelp: 'En bookingkode er pÃ¥krÃ¦vet for at reservere datoer.',
      privateCodeRequired: 'Indtast en bookingkode for at reservere datoer.',
      showPrivateCode: 'Vis bookingkode',
      hidePrivateCode: 'Skjul bookingkode',
      privateCodeError:
        'Koden kunne ikke bruges.',
      periodLabel: 'VÃ¦lg periode',
      periodHelp: 'Klik fÃ¸rste dag og derefter sidste overnatningsdag.',
      previousMonth: 'Forrige mÃ¥ned',
      nextMonth: 'NÃ¦ste mÃ¥ned',
      clearPeriod: 'Ryd',
      availableLegend: 'Ledig',
      selectedLegend: 'Valgt',
      message: 'Besked',
      messagePlaceholder:
        'FortÃ¦l kort hvem der kommer, og om der er sÃ¦rlige Ã¸nsker.',
      estimate: 'Pris',
      nights: 'nÃ¦tter',
      night: 'nat',
      request: 'Reserver datoer',
      guide: 'Vejledende pris',
      availableStatus: 'Valgte datoer er ledige.',
      unavailableStatus: 'Valgte datoer er ikke ledige.',
      unavailableError: 'Datoerne er allerede reserveret eller booket.',
      calendarTitle: 'Optagede perioder',
      reservedLabel: 'Reserveret',
      bookedLabel: 'Booket',
      successTitle: 'Modtaget',
      successBody:
        'Tak. Vi har modtaget dine datoer og vender tilbage personligt.',
      reservedBody: 'Datoerne er registreret. Du fÃ¥r en personlig opfÃ¸lgning.',
      error: 'Noget gik galt. PrÃ¸v igen om lidt.',
      rangeError: 'VÃ¦lg en afrejsedato efter ankomstdatoen.',
      minimumStayError: 'Ophold skal vÃ¦re mindst 7 nÃ¦tter.'
    },
    footer: {
      title: 'Casa Mimosa',
      body: 'En privat villa i Sierrazuela for familie, nÃ¦re venner og udvalgte gÃ¦ster.',
      activities: 'Aktiviteter',
      inventory: 'Inventar',
      booking: 'Reserver datoer'
    }
  },
  en: {
    nav: {
      villa: 'Villa',
      gallery: 'Gallery',
      amenities: 'Amenities',
      location: 'Location',
      activities: 'Activities',
      inventory: 'Inventory',
      pricing: 'Pricing',
      booking: 'Stays'
    },
    hero: {
      eyebrow: 'Private villa in Sierrazuela',
      title: 'Casa Mimosa',
      location: 'Fuengirola / Mijas',
      tagline:
        'A private villa by the coast - calm, sea views and Scandinavian elegance.',
      primaryCta: 'Check availability',
      secondaryCta: 'Explore the villa',
      statOne: '4 bedrooms',
      statTwo: '3 bathrooms',
      statThree: 'Up to 8 guests'
    },
    overview: {
      eyebrow: 'The villa',
      title:
        'Made for slow mornings, long dinners and private days by the pool.',
      body: 'Casa Mimosa is a personal home in Spain for family, close friends and selected guests. The mood is warm and calm: tropical garden and Mediterranean living outside, designer interiors and semi-Nordic restraint inside.',
      items: [
        { value: '4', label: 'bedrooms' },
        { value: '3', label: 'bathrooms' },
        { value: '8', label: 'max guests' },
        { value: '360', label: 'green degrees around the pool' }
      ],
      features: [
        'Sea views from the villa and terraces',
        'Private pool and tropical garden',
        'Rooftop terrace for sunset',
        'Designer interior with semi-Nordic calm'
      ]
    },
    experience: {
      eyebrow: 'Atmosphere',
      title: 'Tropical outside. Calm, luxurious and personal inside.',
      paragraphs: [
        'Casa Mimosa feels like a private home, not a hotel. There is room for swimsuits, barefoot evenings and generous dinners, but also quiet corners, beautiful materials and interiors that do not need to announce themselves loudly.',
        'Outside, the feeling is green and warm with pool, palms and garden calm. Inside, the atmosphere is more restrained: light surfaces, designer objects, natural textures and a soft Scandinavian balance.'
      ],
      details: [
        'Mediterranean living with private distance',
        'Tropical garden around the pool',
        'Quiet luxury rather than resort energy'
      ]
    },
    gallery: {
      eyebrow: 'Gallery',
      title:
        'A visual starting point - ready for real Casa Mimosa photography.',
      body: "These are elegant Unsplash placeholders selected for light, materials and atmosphere. They can be replaced directly with the villa's own photography without changing the layout."
    },
    amenities: {
      eyebrow: 'Highlights',
      title: 'The essentials, wrapped in a private and easygoing setting.',
      items: [
  {
    title: "Sea view",
    description: "Views across the coast and southern light.",
  },
  {
    title: "Private pool",
    description: "A calm pool area reserved for the house.",
  },
  {
    title: "Rooftop terrace",
    description: "A natural place for sunset and aperitif.",
  },
  {
    title: "Tropical garden",
    description: "Green, warm and quietly screened.",
  },
  {
    title: "Designer interior",
    description: "Semi-Nordic style with warm materials.",
  },
  {
    title: "4 bedrooms",
    description: "Generous space for family and close friends.",
  },
  {
    title: "3 bathrooms",
    description: "Comfortable for up to eight guests.",
  },
  {
    title: "Close to beach",
    description: "The beach is within a 4-minute drive.",
  },
  {
    title: "Family-friendly",
    description: "Made for private stays with up to 8 guests.",
  },
  {
    title: "Quiet Sierrazuela",
    description: "Sierrazuela gives space, views and discretion.",
  },
],
    },
    location: {
      eyebrow: 'Location',
      title: 'Sierrazuela: calm, green and close to the Costa del Sol.',
      body: 'The villa is in Sierrazuela by Fuengirola / Mijas, a residential area with more calm than the busiest coastal addresses. From here there is easy access to beaches, restaurants, golf, Andalusian day trips and MÃ¡laga airport.',
      notes: [
        'Quiet villa area with a private character',
        'Close to Fuengirola, Mijas and the beach',
        'A strong base for beach days, golf and exploring'
      ],
      address: 'Calle Mimosa De Sierrezuela 16, Mijas',
      mapLabel: 'Location',
      mapCta: 'Open in Google Maps',
      areaEyebrow: 'The area',
      areaTitle: 'The best of the Costa del Sol within easy reach.',
      areaItems: [
        {
          title: 'Beach and sea',
          description: 'The coast, beach clubs and quiet morning walks by the water fit naturally into the day.'
        },
        {
          title: 'Dinner out',
          description: 'Fuengirola, Mijas and nearby coastal towns offer everything from relaxed tapas to more refined evenings.'
        },
        {
          title: 'Golf and day trips',
          description: 'The area is a strong base for golf, white villages, Marbella, MÃ¡laga and classic Andalusian excursions.'
        },
        {
          title: 'Calm base',
          description: 'Sierrazuela feels private and tucked away, while staying close to what brings people to the Costa del Sol.'
        }
      ]
    },
    guestGuideTeaser: guideCopy.en.guestGuideTeaser,
    guestGuide: guideCopy.en.guestGuide,
    pricing: {
      eyebrow: 'Pricing',
      title: 'Indicative seasonal pricing.',
      body: 'Prices are shown in DKK per day as a simple guide. Final dates and practical details are always handled directly.',
      from: 'from',
      perDay: 'day',
      note: 'If you have a private code, you can add it discreetly in the stay form.'
    },
    booking: {
      eyebrow: 'Stay',
      title: 'Reserve dates at Casa Mimosa.',
      body: 'Choose dates and guests to see availability and pricing. Stays are handled personally so the house keeps its private character.',
      arrival: 'Arrival',
      departure: 'Departure',
      guests: 'Guests',
      name: 'Name',
      email: 'Email',
      privateCode: 'Private code',
      privateCodePlaceholder: 'Enter your private code',
      privateCodeHelp: 'A private code is required to reserve dates.',
      privateCodeRequired: 'Enter a private code to reserve dates.',
      showPrivateCode: 'Show private code',
      hidePrivateCode: 'Hide private code',
      privateCodeError:
        'The code could not be used.',
      periodLabel: 'Choose period',
      periodHelp: 'Click the first day, then the final overnight date.',
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
      clearPeriod: 'Clear',
      availableLegend: 'Available',
      selectedLegend: 'Selected',
      message: 'Message',
      messagePlaceholder:
        'Tell us briefly who is coming and whether you have any wishes.',
      estimate: 'Price',
      nights: 'nights',
      night: 'night',
      request: 'Reserve dates',
      guide: 'Guide price',
      availableStatus: 'Selected dates are available.',
      unavailableStatus: 'Selected dates are not available.',
      unavailableError: 'Those dates are already reserved or booked.',
      calendarTitle: 'Unavailable periods',
      reservedLabel: 'Reserved',
      bookedLabel: 'Booked',
      successTitle: 'Received',
      successBody:
        'Thank you. We have received your dates and will follow up personally.',
      reservedBody:
        'The dates have been registered. You will receive a personal follow-up.',
      error: 'Something went wrong. Please try again shortly.',
      rangeError: 'Choose a departure date after the arrival date.',
      minimumStayError: 'Stays must be at least 7 nights.'
    },
    footer: {
      title: 'Casa Mimosa',
      body: 'A private villa in Sierrazuela for family, close friends and selected guests.',
      activities: 'Activities',
      inventory: 'Inventory',
      booking: 'Reserve dates'
    }
  }
} as const

type DeepEditable<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends readonly (infer Item)[]
  ? DeepEditable<Item>[]
  : T extends object
  ? { -readonly [Key in keyof T]: DeepEditable<T[Key]> }
  : T

export type SiteCopy = DeepEditable<typeof copy['da']>
export type SiteCopyByLanguage = Record<Language, SiteCopy>

export function getCopy (language: Language): SiteCopy {
  return copy[language] as unknown as SiteCopy
}
