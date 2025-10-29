import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAuth } from '@/app/lib/auth'

// Create a new event for the current HOST
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Host privileges required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      eventType,
      venueId,
      startDate,
      endDate,
      startTime,
      endTime,
      price,
      maxAttendees,
      imageUrl,
      hostUserId, // admin mode only
    } = body || {}

    if (!title || !description || !eventType || !venueId || !startDate || !endDate || !startTime || !endTime || !price || !maxAttendees) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Resolve host
    let hostId: string | null = null

    if (user.role === 'HOST') {
      const host = await prisma.host.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!host) {
        return NextResponse.json({ error: 'Host profile not found' }, { status: 400 })
      }
      hostId = host.id
    } else {
      if (!hostUserId) {
        return NextResponse.json({ error: 'hostUserId is required when creating as admin' }, { status: 400 })
      }
      const host = await prisma.host.findUnique({ where: { userId: hostUserId }, select: { id: true } })
      if (!host) {
        return NextResponse.json({ error: 'Target host profile not found' }, { status: 400 })
      }
      hostId = host.id
    }

    const created = await prisma.event.create({
      data: {
        title,
        description,
        eventType,
        venueId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime,
        endTime,
        price: String(price),
        maxAttendees: parseInt(String(maxAttendees), 10),
        imageUrl: imageUrl || null,
        hostId: hostId!,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ success: true, event: created }, { status: 201 })
  } catch (error: any) {
    console.error('Create event error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

// List events for the current HOST
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Host privileges required' }, { status: 403 })
    }

    let hostId: string | null = null

    if (user.role === 'HOST') {
      const host = await prisma.host.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!host) {
        return NextResponse.json({ error: 'Host profile not found' }, { status: 400 })
      }
      hostId = host.id
    } else {
      const url = new URL(request.url)
      const hostUserId = url.searchParams.get('hostUserId')
      if (!hostUserId) {
        return NextResponse.json({ error: 'hostUserId is required for admin listing' }, { status: 400 })
      }
      const host = await prisma.host.findUnique({ where: { userId: hostUserId }, select: { id: true } })
      if (!host) {
        return NextResponse.json({ error: 'Target host profile not found' }, { status: 400 })
      }
      hostId = host.id
    }

    const events = await prisma.event.findMany({
      where: { hostId: hostId! },
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json({ events })
  } catch (error: any) {
    console.error('List events error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
