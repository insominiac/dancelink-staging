import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAuth } from '@/app/lib/auth'

// Create a new class for the current HOST
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
      level,
      durationMins,
      maxCapacity,
      price,
      venueId,
      scheduleDays,
      scheduleTime,
      startDate,
      endDate,
    } = body || {}

    if (!title || !description || !level || !durationMins || !maxCapacity || !price) {
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
      // Admin mode: allow passing hostUserId in body
      const { hostUserId } = body || {}
      if (!hostUserId) {
        return NextResponse.json({ error: 'hostUserId is required when creating as admin' }, { status: 400 })
      }
      const host = await prisma.host.findUnique({ where: { userId: hostUserId }, select: { id: true } })
      if (!host) {
        return NextResponse.json({ error: 'Target host profile not found' }, { status: 400 })
      }
      hostId = host.id
    }

    const created = await prisma.class.create({
      data: {
        title,
        description,
        level,
        durationMins: parseInt(String(durationMins), 10),
        maxCapacity: parseInt(String(maxCapacity), 10),
        price: String(price), // Decimal as string
        scheduleDays: scheduleDays || null,
        scheduleTime: scheduleTime || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        venueId: venueId || null,
        hostId: hostId!,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ success: true, class: created }, { status: 201 })
  } catch (error: any) {
    console.error('Create class error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}

// Optionally list current host classes
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

    const classes = await prisma.class.findMany({
      where: { hostId: hostId! },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ classes })
  } catch (error: any) {
    console.error('List classes error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 })
  }
}
