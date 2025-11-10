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
  
  // CTA Section
  ctaBadgeText?: string
  ctaTitle?: string
  ctaDescription?: string
  ctaButtons?: {
    primary?: { text: string; href: string };
    secondary?: { text: string; href: string };
  };
  ctaFeatures?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
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
  let featuredEvents: Event[] = []
  let pageContent: EventsPageContent | null = null

  try {
    // Fetch featured events for initial render
    console.log('[Events Page] Attempting to fetch featured events from:', apiUrl('public/events?featuredOnly=true'))
    const featuredEventsRes = await fetch(apiUrl('public/events?featuredOnly=true'), { cache: 'no-store' })
    console.log('[Events Page] Featured Events API response status:', featuredEventsRes.status)
    
    if (featuredEventsRes.ok) {
      const data = await featuredEventsRes.json()
      featuredEvents = data.events || []
      console.log('[Events Page] Successfully fetched', featuredEvents.length, 'featured events')
    } else {
      console.warn('[Events API Warning] Failed to fetch featured events:', featuredEventsRes.status, featuredEventsRes.statusText)
    }
    
    // Fetch all events
    console.log('[Events Page] Attempting to fetch all events from:', apiUrl('public/events'))
    const eventsRes = await fetch(apiUrl('public/events'), { cache: 'no-store' })
    console.log('[Events Page] Events API response status:', eventsRes.status)
    
    if (eventsRes.ok) {
      const data = await eventsRes.json()
      events = data.events || []
      console.log('[Events Page] Successfully fetched', events.length, 'events')
    } else {
      console.warn('[Events API Warning] Failed to fetch events:', eventsRes.status, eventsRes.statusText)
      // Try a direct fetch to the external API as fallback
      try {
        console.log('[Events Page] Trying direct fetch to external API')
        const directRes = await fetch('https://dance-api-omega.vercel.app/api/public/events', { 
          cache: 'no-store'
        })
        if (directRes.ok) {
          const data = await directRes.json()
          events = data.events || []
          console.log('[Events Page] Fallback fetch successful, got', events.length, 'events')
        }
      } catch (directError) {
        console.error('[Events Page] Direct fetch also failed:', directError)
      }
      // Provide default events if API call fails
      events = []
    }
    
    // Fetch page content
    console.log('[Events Page] Attempting to fetch page content from:', apiUrl('public/content/events'))
    const contentRes = await fetch(apiUrl('public/content/events'), { cache: 'no-store' })
    console.log('[Events Page] Content API response status:', contentRes.status)
    
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
        noEventsDescription: data.noEventsDescription || 'Check back later for new events',
        ctaBadgeText: data.ctaBadgeText,
        ctaTitle: data.ctaTitle,
        ctaDescription: data.ctaDescription,
        ctaButtons: data.ctaButtons,
        ctaFeatures: data.ctaFeatures
      }
      console.log('[Events Page] Successfully fetched page content')
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
        noEventsDescription: 'Check back later for new events',
        ctaBadgeText: 'Join the Experience',
        ctaTitle: 'Ready to Dance?',
        ctaDescription: 'Don\'t miss out on these exclusive dance events! Book early to secure your spot and join our vibrant community of dancers.',
        ctaButtons: {
          primary: { text: '🎫 Reserve Your Spot', href: '/contact' },
          secondary: { text: '📞 Get Event Updates', href: '/contact' }
        },
        ctaFeatures: [
          { icon: '🎯', title: 'Early Bird Discounts', description: 'Book in advance and save up to 25% on event tickets' },
          { icon: '🎆', title: 'VIP Experience', description: 'Front row seats and exclusive meet & greets available' },
          { icon: '🎁', title: 'Group Packages', description: 'Bring friends and save more with special group rates' }
        ]
      }
    }
  } catch (error) {
    console.error('[Events Page Data Fetch Error]', error)
    // Try a direct fetch to the external API as last resort
    try {
      console.log('[Events Page] Trying direct fetch to external API as last resort')
      const directRes = await fetch('https://dance-api-omega.vercel.app/api/public/events', { 
        cache: 'no-store'
      })
      if (directRes.ok) {
        const data = await directRes.json()
        events = data.events || []
        console.log('[Events Page] Last resort fetch successful, got', events.length, 'events')
      }
    } catch (directError) {
      console.error('[Events Page] Last resort direct fetch also failed:', directError)
    }
    // Provide default values if fetch fails completely
    events = events.length > 0 ? events : [] // Keep any events we might have fetched in fallback
    pageContent = {
      heroTitle: 'Join Our Dance Events',
      heroSubtitle: 'Discover exciting workshops, competitions, and social gatherings in our dance community',
      featuredTitle: 'Featured Events',
      featuredDescription: 'Don\'t miss these special events curated just for you',
      searchTitle: 'Find Your Perfect Event',
      searchDescription: 'Browse through our upcoming events and find the perfect dance experience for you',
      noEventsTitle: 'No events found',
      noEventsDescription: 'Check back later for new events',
      ctaBadgeText: 'Join the Experience',
      ctaTitle: 'Ready to Dance?',
      ctaDescription: 'Don\'t miss out on these exclusive dance events! Book early to secure your spot and join our vibrant community of dancers.',
      ctaButtons: {
        primary: { text: '🎫 Reserve Your Spot', href: '/contact' },
        secondary: { text: '📞 Get Event Updates', href: '/contact' }
      },
      ctaFeatures: [
        { icon: '🎯', title: 'Early Bird Discounts', description: 'Book in advance and save up to 25% on event tickets' },
        { icon: '🎆', title: 'VIP Experience', description: 'Front row seats and exclusive meet & greets available' },
        { icon: '🎁', title: 'Group Packages', description: 'Bring friends and save more with special group rates' }
      ]
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
      'searchTitle', 'searchDescription', 'noEventsTitle', 'noEventsDescription',
      'ctaBadgeText', 'ctaTitle', 'ctaDescription'
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

  return <EventsClient initialEvents={events} initialFeaturedEvents={featuredEvents} initialPageContent={pageContent} initialLang={lang} />
}
