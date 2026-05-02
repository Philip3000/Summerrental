import {
  Bath,
  BedDouble,
  Home,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sun,
  Trees,
  UsersRound,
  Waves
} from 'lucide-react'
import type { SiteCopy } from '@/lib/i18n'

type AmenitiesProps = {
  content: SiteCopy
}

const amenityIcons = [
  Waves,
  Waves,
  Sun,
  Trees,
  Sparkles,
  BedDouble,
  Bath,
  MapPin,
  UsersRound,
  ShieldCheck,
  Leaf,
  Home
]

export default function Amenities ({ content }: AmenitiesProps) {
  return (
    <section id='amenities' className='bg-ivory py-20 md:py-28'>
      <div className='section-shell'>
        <div className='max-w-3xl'>
          <p className='text-sm font-semibold uppercase text-champagne'>
            {content.amenities.eyebrow}
          </p>
          <h2 className='mt-4 font-serif text-4xl leading-tight text-olive text-balance md:text-6xl'>
            {content.amenities.title}
          </h2>
        </div>

        <div className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          {content.amenities.items.map((item, index) => {
            const Icon = amenityIcons[index] ?? Home

            return (
              <article
                key={item.title}
                className='min-h-44 rounded-[8px] border border-olive/10 bg-porcelain p-5 shadow-line transition hover:-translate-y-1 hover:shadow-soft'
              >
                <Icon className='h-5 w-5 text-champagne' aria-hidden='true' />
                <h3 className='mt-5 font-serif text-2xl text-olive'>
                  {item.title}
                </h3>
                <p className='mt-3 text-sm leading-6 text-ink/66'>
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
