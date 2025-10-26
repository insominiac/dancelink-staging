import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '../../../lib/db'
import { resolveLocale } from '@/app/lib/locale'
import { translationService } from '@/lib/translation-service'

export async function GET(request: NextRequest) {
  try {
    await ensureDbConnection()
    const locale = resolveLocale(request, 'en')
    // Fetch only published events that haven't ended
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        endDate: {
          gte: new Date() // Only show future/ongoing events
        }
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            addressLine1: true, // Use addressLine1 instead of address
            addressLine2: true
          }
        },
        eventStyles: {
          include: {
            style: true
          }
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['CONFIRMED', 'COMPLETED']
                }
              }
            }
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' }, // Featured events first
        { startDate: 'asc' }
      ]
    })

    // Calculate current attendees for each event
    let eventsWithAttendeeCount = await Promise.all(events.map(async (event) => {
      // Be resilient if prisma.seatLock is missing in the generated client
      let activeLocks = 0
      try {
        const seatLockModel = (prisma as any).seatLock
        if (seatLockModel?.count) {
          activeLocks = await seatLockModel.count({
            where: { itemType: 'EVENT' as any, itemId: event.id, status: 'ACTIVE' as any, expiresAt: { gt: new Date() } }
          })
        }
      } catch (_) {
        activeLocks = 0
      }
      const bookingsCount = (event as any)?._count?.bookings ?? 0
      return ({
        ...event,
        currentAttendees: bookingsCount + activeLocks
      })
    }))

    // Server-side translation for dynamic fields when locale != en
    if (locale && locale !== 'en') {
      const texts: string[] = []
      const positions: { idx: number, key: 'title'|'description'|'venue.name'|'venue.city' }[] = []
      
      // Helper function to sanitize text for translation
      const sanitizeForTranslation = (text: string): string | null => {
        if (!text || typeof text !== 'string') return null
        const cleaned = text.trim()
        // Skip very short text, single characters, or special characters that cause issues
        if (cleaned.length <= 1 || cleaned === '*' || /^[^a-zA-Z0-9\s]+$/.test(cleaned)) return null
        return cleaned
      }
      
      eventsWithAttendeeCount.forEach((ev, idx) => {
        const titleText = sanitizeForTranslation(ev.title)
        const descriptionText = sanitizeForTranslation(ev.description)
        const venueNameText = sanitizeForTranslation(ev.venue?.name)
        const venueCityText = sanitizeForTranslation(ev.venue?.city)
        
        if (titleText) { texts.push(titleText); positions.push({ idx, key: 'title' }) }
        if (descriptionText) { texts.push(descriptionText); positions.push({ idx, key: 'description' }) }
        if (venueNameText) { texts.push(venueNameText); positions.push({ idx, key: 'venue.name' }) }
        if (venueCityText) { texts.push(venueCityText); positions.push({ idx, key: 'venue.city' }) }
      })
      
      if (texts.length) {
        try {
          const translated = await translationService.translateBatch(texts, locale, 'en')
          let p = 0
          eventsWithAttendeeCount = eventsWithAttendeeCount.map((ev, idx) => {
            const clone: any = { ...ev, venue: ev.venue ? { ...ev.venue } : ev.venue }
            positions.forEach(pos => {
              if (pos.idx === idx) {
                const val = translated[p++] || (pos.key === 'title' ? ev.title : pos.key === 'description' ? ev.description : pos.key === 'venue.name' ? ev.venue?.name : ev.venue?.city)
                if (pos.key === 'title') clone.title = val
                else if (pos.key === 'description') clone.description = val
                else if (pos.key === 'venue.name' && clone.venue) clone.venue.name = val
                else if (pos.key === 'venue.city' && clone.venue) clone.venue.city = val
              }
            })
            return clone
          })
        } catch (translationError) {
          console.warn('Translation failed for events, using original text:', translationError.message)
          // Continue with original text if translation fails
        }
      }
    }

    return NextResponse.json({ 
      events: eventsWithAttendeeCount,
      total: eventsWithAttendeeCount.length 
    })
  } catch (error) {
    console.error('Error fetching public events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
