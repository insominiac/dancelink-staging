import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '../../../../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDbConnection()
    
    const { id } = params

    // Fetch the specific event
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            addressLine1: true,
            addressLine2: true
          }
        },
        eventStyles: {
          include: {
            style: true
          }
        },
        organizer: {
          select: {
            id: true,
            fullName: true,
            email: true
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
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Calculate current attendees
    let activeLocks = 0
    try {
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
    const eventWithAttendees = {
      ...event,
      price: event.price.toString(), // Convert Decimal to string
      currentAttendees: bookingsCount + activeLocks
    }

    return NextResponse.json({ event: eventWithAttendees })
  } catch (error) {
    console.error('[Event Detail API] Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
