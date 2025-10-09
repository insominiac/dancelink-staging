import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAuth } from '@/app/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Host privileges required' }, { status: 403 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Resolve host id
    let hostId: string | null = null
    if (user.role === 'HOST') {
      const host = await prisma.host.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!host) {
        return NextResponse.json({ error: 'Host profile not found' }, { status: 400 })
      }
      hostId = host.id
    } else {
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

    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        where: {
          OR: [
            { class: { hostId: hostId! } },
            { event: { hostId: hostId! } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          class: { select: { id: true, title: true } },
          event: { select: { id: true, title: true } },
        },
      }),
      prisma.booking.count({
        where: {
          OR: [
            { class: { hostId: hostId! } },
            { event: { hostId: hostId! } },
          ],
        },
      }),
    ])

    const bookings = items.map(b => ({
      id: b.id,
      user: b.user ? { fullName: b.user.fullName, email: b.user.email } : null,
      bookingDate: b.bookingDate,
      status: b.status,
      totalAmount: b.totalAmount,
      type: b.classId ? 'CLASS' : b.eventId ? 'EVENT' : 'UNKNOWN',
      title: b.class ? b.class.title : b.event ? b.event.title : '—',
    }))

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Host bookings list error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
