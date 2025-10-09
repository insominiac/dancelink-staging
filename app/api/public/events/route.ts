import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/db'
import { resolveLocale } from '@/app/lib/locale'
import { translationService } from '@/lib/translation-service'

export async function GET(request: NextRequest) {
  try {
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
    let eventsWithAttendeeCount = events.map(event => ({
      ...event,
      currentAttendees: event._count.bookings
    }))

    // Server-side translation for dynamic fields when locale != en
    if (locale && locale !== 'en') {
      const texts: string[] = []
      const positions: { idx: number, key: 'title'|'description'|'venue.name'|'venue.city' }[] = []
      eventsWithAttendeeCount.forEach((ev, idx) => {
        if (ev.title) { texts.push(ev.title); positions.push({ idx, key: 'title' }) }
        if (ev.description) { texts.push(ev.description); positions.push({ idx, key: 'description' }) }
        if (ev.venue?.name) { texts.push(ev.venue.name); positions.push({ idx, key: 'venue.name' }) }
        if (ev.venue?.city) { texts.push(ev.venue.city); positions.push({ idx, key: 'venue.city' }) }
      })
      if (texts.length) {
        const translated = await translationService.translateBatch(texts, locale, 'en')
        let p = 0
        eventsWithAttendeeCount = eventsWithAttendeeCount.map((ev, idx) => {
          const clone: any = { ...ev, venue: ev.venue ? { ...ev.venue } : ev.venue }
          positions.forEach(pos => {
            if (pos.idx === idx) {
              const val = translated[p++]
              if (pos.key === 'title') clone.title = val
              else if (pos.key === 'description') clone.description = val
              else if (pos.key === 'venue.name' && clone.venue) clone.venue.name = val
              else if (pos.key === 'venue.city' && clone.venue) clone.venue.city = val
            }
          })
          return clone
        })
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
