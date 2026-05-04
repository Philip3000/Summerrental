import { Leaf, ShieldCheck, Sun } from 'lucide-react'
import Image from 'next/image'
import type { Language, SiteCopy } from '@/lib/i18n'
import {
  getImageObjectPosition,
  getSectionImageMinHeight,
  getSiteImage
} from '@/lib/siteContent'
import type { SiteContent } from '@/types/site'

type ExperienceSectionProps = {
  content: SiteCopy
  language: Language
  siteContent: SiteContent
}

const detailIcons = [Sun, Leaf, ShieldCheck]

export default function ExperienceSection ({
  content,
  language,
  siteContent
}: ExperienceSectionProps) {
  const image = getSiteImage(siteContent, 'experience')

  return (
    <section data-header-theme='light' className='bg-ivory py-20 md:py-28'>
      <div className='section-shell grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-center'>
        <div
          className='relative overflow-hidden rounded-[8px] bg-olive shadow-soft'
          style={{ minHeight: getSectionImageMinHeight(image) }}
        >
          <Image
            src={image?.src ?? ''}
            alt={image?.alt[language] ?? 'Warm designer villa interior'}
            fill
            sizes='(min-width: 1024px) 42vw, 100vw'
            className='object-cover'
            style={{ objectPosition: getImageObjectPosition(image) }}
          />
          <div className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/46 to-transparent' />
        </div>

        <div>
          <p className='text-sm font-semibold uppercase text-champagne'>
            {content.experience.eyebrow}
          </p>
          <h2 className='mt-4 font-serif text-4xl leading-tight text-olive text-balance md:text-6xl'>
            {content.experience.title}
          </h2>
          <div className='mt-7 space-y-5 text-lg leading-8 text-ink/70'>
            {content.experience.paragraphs.map((paragraph, index) => (
              <p key={`paragraph-${index}`}>{paragraph}</p>
            ))}
          </div>
          <div className='mt-9 grid gap-4 md:grid-cols-3'>
            {content.experience.details.map((detail, index) => {
              const Icon = detailIcons[index] ?? Sun

              return (
                <div
                  className='border-t border-olive/14 pt-4'
                  key={`detail-${index}`}
                >
                  <Icon className='h-5 w-5 text-champagne' aria-hidden='true' />
                  <p className='mt-3 text-sm leading-6 text-ink/72'>{detail}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
