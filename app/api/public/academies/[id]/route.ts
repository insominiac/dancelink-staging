import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

// GET /api/public/academies/[id]
// Returns a single published academy with related public info
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const academy = await prisma.academy.findUnique({
      where: { id: params.id },
      include: {
        host: { select: { id: true, city: true, country: true } },
      },
    })

    if (!academy || academy.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Academy not found' }, { status: 404 })
    }

    const hostId = academy.hostId

    // Fetch related published content for display
    const [venues, classes, events] = await Promise.all([
      prisma.venue.findMany({
        where: { hostId, status: 'PUBLISHED' },
        select: { id: true, name: true, city: true, state: true, country: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.class.findMany({
        where: { hostId, status: 'PUBLISHED' },
        select: { id: true, title: true, level: true, price: true, startDate: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.event.findMany({
        where: { hostId, status: 'PUBLISHED' },
        select: { id: true, title: true, eventType: true, startDate: true, endDate: true, price: true },
        orderBy: { startDate: 'desc' },
        take: 6,
      }),
    ])

    return NextResponse.json({ academy, venues, classes, events })
  } catch (error) {
    console.error('Public academy detail error:', error)
    return NextResponse.json({ error: 'Failed to fetch academy' }, { status: 500 })
  }
}
