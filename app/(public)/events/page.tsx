import { headers } from 'next/headers'
import EventsClient from './EventsClient'
import { translationService } from '@/lib/translation-service'
import { generateMetadata as genMeta } from '@/app/lib/seo'
import { apiUrl } from '@/app/lib/api'

export const dynamic = 'force-dynamic'

interface Event {
  id: string
  title: string
  description: string
  eventType: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  price: string
  maxAttendees: number
  currentAttendees: number
  status: string
  isFeatured: boolean
  venue?: { name: string; city: string }
  eventStyles?: any[]
  imageUrl?: string
}

interface EventsPageContent {
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  
  // Featured Events
  featuredTitle: string
  featuredDescription: string
  
  // Search
  searchTitle: string
  searchDescription: string
  
  // No Events
  noEventsTitle?: string
  noEventsDescription?: string
}

export async function generateMetadata() {
  try {
    const res = await fetch(apiUrl('seo?path=/events'), { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      return genMeta('/events', data.seoData)
    }
  } catch {}
  return genMeta('/events', null)
}

export default async function EventsPage() {
  // Detect language from cookie or Accept-Language
  const h = headers()
  const cookie = h.get('cookie') || ''
  const cookieLang = (cookie.match(/(?:^|;\s*)i18next=([^;]+)/)?.[1] || '').split('-')[0]
  const accept = h.get('accept-language') || ''
  const acceptLang = accept.split(',')[0]?.split('-')[0]
  const rawLang = (cookieLang || acceptLang || 'en').toLowerCase()
  const lang = /^[a-z]{2}$/.test(rawLang) ? (rawLang as string) : 'en'

  let events: Event[] = []
  let pageContent: EventsPageContent | null = null

  try {
    // Fetch all events
    const eventsRes = await fetch(apiUrl('public/events'), { cache: 'no-store' })
    if (eventsRes.ok) {
      const data = await eventsRes.json()
      events = data.events || []
    } else {
      console.warn('[Events API Warning] Failed to fetch events:', eventsRes.status, eventsRes.statusText)
      // Provide default events if API call fails
      events = []
    }
    
    // Fetch page content
    const contentRes = await fetch(apiUrl('public/content/events'), { cache: 'no-store' })
    if (contentRes.ok) {
      const data = await contentRes.json()
      // Map the API response to the expected structure
      pageContent = {
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        featuredTitle: data.featuredTitle,
        featuredDescription: data.featuredDescription,
        searchTitle: data.searchTitle,
        searchDescription: data.searchDescription,
        noEventsTitle: data.noEventsTitle || 'No events found',
        noEventsDescription: data.noEventsDescription || 'Check back later for new events'
      }
    } else {
      console.warn('[Content API Warning] Failed to fetch content:', contentRes.status, contentRes.statusText)
      // Provide default content if API call fails
      pageContent = {
        heroTitle: 'Join Our Dance Events',
        heroSubtitle: 'Discover exciting workshops, competitions, and social gatherings in our dance community',
        featuredTitle: 'Featured Events',
        featuredDescription: 'Don\'t miss these special events curated just for you',
        searchTitle: 'Find Your Perfect Event',
        searchDescription: 'Browse through our upcoming events and find the perfect dance experience for you',
        noEventsTitle: 'No events found',
        noEventsDescription: 'Check back later for new events'
      }
    }
  } catch (error) {
    console.error('[Events Page Data Fetch Error]', error)
    // Provide default values if fetch fails completely
    events = []
    pageContent = {
      heroTitle: 'Join Our Dance Events',
      heroSubtitle: 'Discover exciting workshops, competitions, and social gatherings in our dance community',
      featuredTitle: 'Featured Events',
      featuredDescription: 'Don\'t miss these special events curated just for you',
      searchTitle: 'Find Your Perfect Event',
      searchDescription: 'Browse through our upcoming events and find the perfect dance experience for you',
      noEventsTitle: 'No events found',
      noEventsDescription: 'Check back later for new events'
    }
  }

  // SSR translate dynamic content when not English
  if (lang && lang !== 'en' && events.length) {
    const texts: string[] = []
    const mapIdx: { i: number; field: 'title' | 'description' }[] = []
    events.forEach((e, i) => {
      texts.push(e.title || '')
      mapIdx.push({ i, field: 'title' })
      texts.push(e.description || '')
      mapIdx.push({ i, field: 'description' })
    })
    try {
      const translated = await translationService.translateBatch(texts, lang, 'en')
      translated.forEach((val, idx) => {
        const m = mapIdx[idx]
        if (m) {
          events[m.i][m.field] = val
        }
      })
    } catch (e) {
      // On error, keep original texts
    }
  }

  if (lang && lang !== 'en' && pageContent) {
    const contentTexts: string[] = []
    const keys: Array<keyof EventsPageContent> = [
      'heroTitle', 'heroSubtitle', 'featuredTitle', 'featuredDescription', 
      'searchTitle', 'searchDescription', 'noEventsTitle', 'noEventsDescription'
    ]
    const keyIndex: { key: keyof EventsPageContent }[] = []
    keys.forEach((k) => {
      const v = (pageContent as any)[k]
      if (typeof v === 'string' && v.trim()) {
        contentTexts.push(v)
        keyIndex.push({ key: k })
      }
    })
    try {
      if (contentTexts.length) {
        const out = await translationService.translateBatch(contentTexts, lang, 'en')
        out.forEach((val, idx) => {
          const k = keyIndex[idx]?.key
          if (k) (pageContent as any)[k] = val
        })
      }
    } catch {}
  }

  return <EventsClient initialEvents={events} initialPageContent={pageContent} initialLang={lang} />
}
