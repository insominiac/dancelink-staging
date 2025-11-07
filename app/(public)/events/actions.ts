'use server'

import prisma, { ensureDbConnection } from '@/app/lib/db'

export interface Event {
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

export async function getAllEvents(): Promise<Event[]> {
  try {
    await ensureDbConnection()
    
    // Fetch all published events that haven't ended
    const dbEvents = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        endDate: {
          gte: new Date()
        }
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            addressLine1: true,
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
        { isFeatured: 'desc' },
        { startDate: 'asc' }
      ]
    })
    
    // Transform database results to match the expected Event interface
    const events: Event[] = await Promise.all(dbEvents.map(async (event) => {
      // Calculate current attendees (similar to the API implementation)
      let activeLocks = 0
      try {
        // Be resilient if prisma.seatLock is missing in the generated client
        const seatLockModel = (prisma as any).seatLock
        if (seatLockModel?.count) {
          activeLocks = await seatLockModel.count({
            where: { 
              itemType: 'EVENT' as any, 
              itemId: event.id, 
              status: 'ACTIVE' as any, 
              expiresAt: { gt: new Date() } 
            }
          })
        }
      } catch (_) {
        activeLocks = 0
      }
      const bookingsCount = (event as any)?._count?.bookings ?? 0
      const currentAttendees = bookingsCount + activeLocks
      
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        startTime: event.startTime,
        endTime: event.endTime,
        // Convert Decimal to string to avoid React Client Component issues
        price: event.price.toString(),
        maxAttendees: event.maxAttendees,
        currentAttendees: currentAttendees,
        status: event.status,
        isFeatured: event.isFeatured,
        venue: event.venue,
        eventStyles: event.eventStyles,
        // Handle null imageUrl
        imageUrl: event.imageUrl || undefined
      }
    }))
    
    return events
  } catch (error) {
    console.error('[Server Action] Error fetching all events:', error)
    return []
  }
}