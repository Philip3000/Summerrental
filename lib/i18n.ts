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
      da: 'Lyst designerinteriør med rolige naturmaterialer',
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
      da: 'Raffineret villaarkitektur omgivet af grønne omgivelser',
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
      location: 'Området',
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
      statOne: '4 soveværelser',
      statTwo: '3 badeværelser',
      statThree: 'Op til 8 gæster'
    },
    overview: {
      eyebrow: 'Villaen',
      title:
        'Nyd langsomme morgener, lange middage og private dage ved poolen.',
      body: 'Casa Mimosa er et personligt hjem i Spanien med plads til familie, nære venner og udvalgte gæster. Udtrykket er varmt og roligt: tropisk have og middelhavsliv udenfor, designerinteriør og semi-nordisk lethed indenfor.',
      items: [
        { value: '4', label: 'soveværelser' },
        { value: '3', label: 'badeværelser' },
        { value: '8', label: 'maks. gæster' },
        { value: '360', label: 'grønt omkring poolen' }
      ],
      features: [
        'Havudsigt fra villa og terrasse',
        'Privat pool og tropisk have',
        'Rooftop-terrasse til solnedgang',
        'Designerinteriør med semi-nordisk ro'
      ]
    },
    experience: {
      eyebrow: 'Atmosfære',
      title: 'Tropisk udenfor. Roligt, luksuriøst og personligt indenfor.',
      paragraphs: [
        'Casa Mimosa føles som et privat hjem, ikke som et hotel. Her er plads til badetøj, barfodede aftener og lange middage, men også til rolige hjørner, smukke materialer og et interiør der ikke behøver at imponere højt.',
        'Udenfor er stemningen grøn og varm med pool, palmer og havefornemmelse. Indenfor er den mere tilbageholdt: lyse flader, designerobjekter, naturlige teksturer og en behagelig skandinavisk balance.'
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
      body: 'Billederne er elegante Unsplash-pladsholdere, valgt for lys, materialer og stemning. De kan udskiftes direkte med villaens egne fotos uden at ændre layoutet.'
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
          description: 'Et roligt poolområde kun for huset.'
        },
        {
          title: 'Rooftop-terrasse',
          description: 'Et naturligt sted til solnedgang og aperitif.'
        },
        {
          title: 'Tropisk have',
          description: 'Grøn, varm og afskærmet atmosfære.'
        },
        {
          title: 'Designerinteriør',
          description: 'Semi-nordisk stil med varme materialer.'
        },
        {
          title: '4 soveværelser',
          description: 'God plads til familie og nære venner.'
        },
        {
          title: '3 badeværelser',
          description: 'Komfortabelt for op til otte gæster.'
        },
        {
          title: 'Nær stranden',
          description: 'Stranden er inden for 4 minutters kørsel.'
        },
        {
          title: 'Familievenlig',
          description: 'Til private ophold med op til 8 gæster.'
        },
        {
          title: 'Rolig beliggenhed',
          description: 'Sierrazuela giver luft, udsigt og diskretion.'
        }
      ]
    },
    location: {
      eyebrow: 'Beliggenhed',
      title: 'Sierrazuela: roligt, grønt og tæt på Costa del Sol.',
      body: 'Villaen ligger i Sierrazuela ved Fuengirola / Mijas, et beboelsesområde med mere ro end kystens travleste adresser. Herfra er der nem adgang til strand, restauranter, golf, dagsture i Andalusien og Málaga lufthavn.',
      notes: [
        'Roligt villaområde med privat karakter',
        'Tæt på Fuengirola, Mijas og stranden',
        'God base for stranddage, golf og udflugter'
      ],
      address: 'Calle Mimosa De Sierrezuela 16, Mijas',
      mapLabel: 'Placering',
      mapCta: 'Åbn i Google Maps',
      areaEyebrow: 'Området',
      areaTitle: 'Det bedste af Costa del Sol inden for rækkevidde.',
      areaItems: [
        {
          title: 'Strand og hav',
          description: 'Kysten, strandklubber og rolige morgenture langs vandet ligger naturligt i dagens rytme.'
        },
        {
          title: 'Middage ude',
          description: 'Fuengirola, Mijas og nærliggende kystbyer giver adgang til alt fra afslappede tapas til mere raffinerede aftener.'
        },
        {
          title: 'Golf og dagsture',
          description: 'Området er et stærkt udgangspunkt for golf, hvide landsbyer, Marbella, Málaga og klassiske andalusiske udflugter.'
        },
        {
          title: 'Rolig base',
          description: 'Sierrazuela føles privat og tilbagetrukket, men stadig tæt på det, man faktisk rejser til Costa del Sol for.'
        }
      ]
    },
    guestGuideTeaser: {
      eyebrow: 'Gæsteguide',
      title: 'Planlæg dagene omkring Casa Mimosa.',
      body: 'To praktiske sider samler udflugter, officielle links og det inventar gæster ofte spørger efter før ankomst.',
      excursionsTitle: 'Udflugter',
      excursionsBody: 'Kystbyer, hvide landsbyer, kulturbyer og større dagsture fra villaen.',
      excursionsCta: 'Se udflugter',
      inventoryTitle: 'Inventar',
      inventoryBody: 'Køkken, grill, vask, pool, tekstiler og praktiske ting i huset.',
      inventoryCta: 'Se inventar'
    },
    guestGuide: {
      excursions: {
        eyebrow: 'Casa Mimosa guide',
        title: 'Udflugter fra villaen',
        intro: 'Et roligt overblik over de steder, der giver mest mening fra Casa Mimosa: kystbyer, bjerglandsbyer, kulturbyer og store andalusiske dagsoplevelser.',
        imageAlt: 'Costa del Sol kyst som udgangspunkt for udflugter fra Casa Mimosa',
        groups: [
          {
            title: 'Tæt på Casa Mimosa',
            description: 'Rolige valg til halve dage, frokoster ude og spontane ture fra Sierrazuela.',
            links: [
              {
                title: 'Mijas Pueblo',
                eyebrow: 'Hvid landsby og udsigt',
                description: 'Klassisk andalusisk landsbystemning, små gader, udsigtspunkter og lokale restauranter.',
                href: 'https://turismo.mijas.es/en/'
              },
              {
                title: 'Málaga',
                eyebrow: 'Kunst, shopping og byliv',
                description: 'Picasso, Alcazaba, marina, gamle gader og en god frokostby, når man vil have kultur uden en lang dag.',
                href: 'https://www.spain.info/en/destination/malaga/'
              },
              {
                title: 'Marbella',
                eyebrow: 'Beach clubs og gammel by',
                description: 'En mere poleret kystdag med gamle gader, havn, strandliv og gode middagsmuligheder.',
                href: 'https://turismo.marbella.es/'
              },
              {
                title: 'Estepona',
                eyebrow: 'Blomster, hav og roligere tempo',
                description: 'En elegant kystby med strandpromenade, marina og et mere afdæmpet tempo end de travleste adresser.',
                href: 'https://turismo.estepona.es/'
              }
            ]
          },
          {
            title: 'Store dagsture',
            description: 'Udflugter der fortjener lidt planlægning, tidlig afgang og en god frokostreservation.',
            links: [
              {
                title: 'Ronda',
                eyebrow: 'Kløft, broer og dramatisk landskab',
                description: 'Puente Nuevo, gamle kvarterer og stærke udsigter i en af Andalusiens mest markante byer.',
                href: 'https://www.spain.info/en/destination/ronda/'
              },
              {
                title: 'Córdoba',
                eyebrow: 'Mezquita og historiske gårdhaver',
                description: 'En raffineret kulturtur med Mezquita-Catedral, jødiske kvarterer og klassisk andalusisk atmosfære.',
                href: 'https://www.spain.info/en/destination/cordoba/'
              },
              {
                title: 'Granada og Alhambra',
                eyebrow: 'Moorish paladser og bjergluft',
                description: 'Planlæg billetter i god tid. Alhambra og Generalife er en af de stærkeste kulturudflugter i Andalusien.',
                href: 'https://turismo.granada.org/en/alhambra-granada'
              },
              {
                title: 'Nerja',
                eyebrow: 'Klipper, grotter og Balcón de Europa',
                description: 'En kystdag mod øst med grotter, udsigt og mulighed for at kombinere med Frigiliana.',
                href: 'https://www.spain.info/en/destination/nerja/'
              },
              {
                title: 'Frigiliana',
                eyebrow: 'Hvid bjerglandsby',
                description: 'Smalle gader, keramik, udsigter og rolig landsbystemning tæt på Nerja.',
                href: 'https://www.spain.info/en/destination/frigiliana/'
              },
              {
                title: 'Caminito del Rey',
                eyebrow: 'Dramatisk gangbro i kløften',
                description: 'En mere aktiv udflugt, hvor billetter bør bookes på den officielle side.',
                href: 'https://www.caminitodelrey.info/'
              },
              {
                title: 'Sevilla',
                eyebrow: 'Storby, flamenco og Plaza de España',
                description: 'En lang, men mindeværdig heldagstur for dem der vil have Andalusiens mest ikoniske bystemning.',
                href: 'https://www.spain.info/en/destination/seville/'
              }
            ]
          }
        ]
      },
      inventory: {
        eyebrow: 'Casa Mimosa inventar',
        title: 'Alt det praktiske i huset',
        intro: 'En samlet liste over det, gæster typisk spørger efter før et ophold: køkkenudstyr, vask, grill, pool, terrasse, tekstiler og komfort i huset.',
        imageAlt: 'Elegant køkken og interiørdetaljer som inventar på Casa Mimosa',
        groups: [
          {
            title: 'Køkken og servering',
            description: 'Til lange middage, morgenmad i roligt tempo og enkel madlavning hjemme.',
            items: ['Ovn og kogeplade', 'Køleskab og fryser', 'Opvaskemaskine', 'Kaffemaskine', 'Elkedel', 'Brødrister', 'Gryder, pander og ovnfade', 'Knive, skærebrætter og køkkenredskaber', 'Service, glas, vinglas og bestik', 'Serveringsfade, skåle og karafler']
          },
          {
            title: 'Udeområder',
            description: 'Det praktiske omkring pool, terrasse og aftener ude.',
            items: ['Privat pool', 'Solsenge', 'Udendørs spiseplads', 'Grill', 'Rooftop-terrasse', 'Have- og terrasseområder', 'Udendørs belysning', 'Poolhåndklæder']
          },
          {
            title: 'Vask og praktisk',
            description: 'Små ting der gør et længere ophold nemmere.',
            items: ['Vaskemaskine', 'Strygejern', 'Strygebræt', 'Tørrestativ', 'Støvsuger', 'Rengøringsartikler', 'Ekstra puder og tæpper', 'Håndklæder og sengetøj']
          },
          {
            title: 'Komfort i huset',
            description: 'Til rolige dage inde, arbejde ved behov og ophold med flere gæster.',
            items: ['Wi-fi', 'Aircondition', 'Varme', 'Smart TV', 'Garderobe- og opbevaringsplads', 'Flere opholdszoner', 'Spiseplads inde', 'Parkeringsmulighed ved villaen']
          },
          {
            title: 'Familie og strand',
            description: 'Til nemmere dage ved vandet og ophold med børn eller flere generationer.',
            items: ['Strandhåndklæder', 'Let adgang til kysten', 'Plads til op til 8 gæster', 'Flere badeværelser', 'Roligt boligområde', 'Fleksible fællesområder']
          },
          {
            title: 'Stemning og detaljer',
            description: 'De små ting der får huset til at føles som et privat hjem.',
            items: ['Designerinteriør', 'Tropisk havefornemmelse', 'Udvalgte materialer og tekstiler', 'Dekorative serveringsdele', 'Læsehjørner og rolige zoner', 'Udsigtspunkter omkring huset']
          }
        ]
      }
    },
    pricing: {
      eyebrow: 'Priser',
      title: 'Vejledende priser efter sæson.',
      body: 'Priserne er angivet i DKK pr. dag og giver et enkelt overblik. Endelige datoer og praktiske detaljer aftales altid direkte.',
      from: 'fra',
      perDay: 'dag',
      note: 'Har du en privat kode, kan den bruges diskret i formularen for ophold.'
    },
    booking: {
      eyebrow: 'Ophold',
      title: 'Reserver datoer på Casa Mimosa.',
      body: 'Vælg datoer og antal gæster for at se ledighed og pris. Ophold håndteres personligt, så huset bevarer sin private karakter.',
      arrival: 'Ankomst',
      departure: 'Afrejse',
      guests: 'Gæster',
      name: 'Navn',
      email: 'Email',
      privateCode: 'Bookingkode',
      privateCodePlaceholder: 'Skriv din bookingkode',
      privateCodeHelp: 'En bookingkode er påkrævet for at reservere datoer.',
      privateCodeRequired: 'Indtast en bookingkode for at reservere datoer.',
      showPrivateCode: 'Vis bookingkode',
      hidePrivateCode: 'Skjul bookingkode',
      privateCodeError:
        'Koden kunne ikke bruges.',
      periodLabel: 'Vælg periode',
      periodHelp: 'Klik første dag og derefter sidste overnatningsdag.',
      previousMonth: 'Forrige måned',
      nextMonth: 'Næste måned',
      clearPeriod: 'Ryd',
      availableLegend: 'Ledig',
      selectedLegend: 'Valgt',
      message: 'Besked',
      messagePlaceholder:
        'Fortæl kort hvem der kommer, og om der er særlige ønsker.',
      estimate: 'Pris',
      nights: 'nætter',
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
      reservedBody: 'Datoerne er registreret. Du får en personlig opfølgning.',
      error: 'Noget gik galt. Prøv igen om lidt.',
      rangeError: 'Vælg en afrejsedato efter ankomstdatoen.',
      minimumStayError: 'Ophold skal være mindst 7 nætter.'
    },
    footer: {
      title: 'Casa Mimosa',
      body: 'En privat villa i Sierrazuela for familie, nære venner og udvalgte gæster.',
      excursions: 'Udflugter',
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
      body: 'The villa is in Sierrazuela by Fuengirola / Mijas, a residential area with more calm than the busiest coastal addresses. From here there is easy access to beaches, restaurants, golf, Andalusian day trips and Málaga airport.',
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
          description: 'The area is a strong base for golf, white villages, Marbella, Málaga and classic Andalusian excursions.'
        },
        {
          title: 'Calm base',
          description: 'Sierrazuela feels private and tucked away, while staying close to what brings people to the Costa del Sol.'
        }
      ]
    },
    guestGuideTeaser: {
      eyebrow: 'Guest guide',
      title: 'Plan the days around Casa Mimosa.',
      body: 'Two practical pages collect excursions, official links and the house inventory guests often ask about before arrival.',
      excursionsTitle: 'Excursions',
      excursionsBody: 'Coastal towns, white villages, culture cities and larger Andalusian day trips from the villa.',
      excursionsCta: 'View excursions',
      inventoryTitle: 'Inventory',
      inventoryBody: 'Kitchen, grill, laundry, pool, textiles and practical things in the house.',
      inventoryCta: 'View inventory'
    },
    guestGuide: {
      excursions: {
        eyebrow: 'Casa Mimosa guide',
        title: 'Excursions from the villa',
        intro: 'A calm overview of the places that make the most sense from Casa Mimosa: coastal towns, mountain villages, culture cities and larger Andalusian day experiences.',
        imageAlt: 'Costa del Sol coastline as a base for excursions from Casa Mimosa',
        groups: [
          {
            title: 'Close to Casa Mimosa',
            description: 'Easy choices for half-days, lunches out and spontaneous trips from Sierrazuela.',
            links: [
              {
                title: 'Mijas Pueblo',
                eyebrow: 'White village and views',
                description: 'Classic Andalusian village atmosphere, small streets, viewpoints and local restaurants.',
                href: 'https://turismo.mijas.es/en/'
              },
              {
                title: 'Malaga',
                eyebrow: 'Art, shopping and city life',
                description: 'Picasso, Alcazaba, marina, old streets and a strong lunch city when you want culture without a long day.',
                href: 'https://www.spain.info/en/destination/malaga/'
              },
              {
                title: 'Marbella',
                eyebrow: 'Beach clubs and old town',
                description: 'A more polished coastal day with old streets, harbour life, beach time and good dinner options.',
                href: 'https://turismo.marbella.es/'
              },
              {
                title: 'Estepona',
                eyebrow: 'Flowers, sea and a calmer pace',
                description: 'An elegant coastal town with a promenade, marina and a softer rhythm than the busiest addresses.',
                href: 'https://turismo.estepona.es/'
              }
            ]
          },
          {
            title: 'Larger day trips',
            description: 'Excursions that deserve a little planning, an early start and a good lunch reservation.',
            links: [
              {
                title: 'Ronda',
                eyebrow: 'Gorge, bridges and dramatic landscape',
                description: "Puente Nuevo, old quarters and strong views in one of Andalusia's most distinctive towns.",
                href: 'https://www.spain.info/en/destination/ronda/'
              },
              {
                title: 'Cordoba',
                eyebrow: 'Mezquita and historic courtyards',
                description: 'A refined cultural day with the Mezquita-Catedral, Jewish quarter and classic Andalusian atmosphere.',
                href: 'https://www.spain.info/en/destination/cordoba/'
              },
              {
                title: 'Granada and Alhambra',
                eyebrow: 'Moorish palaces and mountain air',
                description: 'Plan tickets well ahead. Alhambra and Generalife are among the strongest cultural excursions in Andalusia.',
                href: 'https://turismo.granada.org/en/alhambra-granada'
              },
              {
                title: 'Nerja',
                eyebrow: 'Cliffs, caves and Balcon de Europa',
                description: 'A coastal day eastwards with caves, viewpoints and the option to combine it with Frigiliana.',
                href: 'https://www.spain.info/en/destination/nerja/'
              },
              {
                title: 'Frigiliana',
                eyebrow: 'White mountain village',
                description: 'Narrow streets, ceramics, views and a calm village feel close to Nerja.',
                href: 'https://www.spain.info/en/destination/frigiliana/'
              },
              {
                title: 'Caminito del Rey',
                eyebrow: 'Dramatic walkway through the gorge',
                description: 'A more active excursion where tickets should be booked on the official site.',
                href: 'https://www.caminitodelrey.info/'
              },
              {
                title: 'Seville',
                eyebrow: 'City life, flamenco and Plaza de Espana',
                description: "A long but memorable day trip for guests who want Andalusia's most iconic city atmosphere.",
                href: 'https://www.spain.info/en/destination/seville/'
              }
            ]
          }
        ]
      },
      inventory: {
        eyebrow: 'Casa Mimosa inventory',
        title: 'Everything practical in the house',
        intro: 'A collected list of what guests usually ask about before a stay: kitchen equipment, laundry, grill, pool, terrace, textiles and comfort in the house.',
        imageAlt: 'Elegant kitchen and interior details representing the Casa Mimosa inventory',
        groups: [
          {
            title: 'Kitchen and serving',
            description: 'For long dinners, slow breakfasts and simple cooking at home.',
            items: ['Oven and hob', 'Fridge and freezer', 'Dishwasher', 'Coffee machine', 'Electric kettle', 'Toaster', 'Pots, pans and oven dishes', 'Knives, cutting boards and kitchen tools', 'Dinnerware, glasses, wine glasses and cutlery', 'Serving platters, bowls and carafes']
          },
          {
            title: 'Outdoor areas',
            description: 'The practical details around the pool, terrace and evenings outside.',
            items: ['Private pool', 'Sun loungers', 'Outdoor dining area', 'Grill', 'Rooftop terrace', 'Garden and terrace areas', 'Outdoor lighting', 'Pool towels']
          },
          {
            title: 'Laundry and practical',
            description: 'Small things that make a longer stay easier.',
            items: ['Washing machine', 'Iron', 'Ironing board', 'Drying rack', 'Vacuum cleaner', 'Cleaning supplies', 'Extra pillows and blankets', 'Towels and bed linen']
          },
          {
            title: 'Comfort in the house',
            description: 'For quiet days inside, work when needed and stays with several guests.',
            items: ['Wi-fi', 'Air conditioning', 'Heating', 'Smart TV', 'Wardrobe and storage space', 'Several living zones', 'Indoor dining area', 'Parking by the villa']
          },
          {
            title: 'Family and beach',
            description: 'For easier days by the water and stays with children or several generations.',
            items: ['Beach towels', 'Easy access to the coast', 'Space for up to 8 guests', 'Several bathrooms', 'Quiet residential area', 'Flexible shared spaces']
          },
          {
            title: 'Atmosphere and details',
            description: 'The small things that make the house feel like a private home.',
            items: ['Designer interior', 'Tropical garden feeling', 'Selected materials and textiles', 'Decorative serving pieces', 'Reading corners and quiet zones', 'Viewpoints around the house']
          }
        ]
      }
    },
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
      excursions: 'Excursions',
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
