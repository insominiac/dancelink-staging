import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

// List competition requests for current host
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Host privileges required' }, { status: 403 })
    }

    let hostId: string | null = null
    if (user.role === 'HOST') {
      const host = await prisma.host.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!host) return NextResponse.json({ error: 'Host profile not found' }, { status: 400 })
      hostId = host.id
    } else {
      const url = new URL(request.url)
      const hostUserId = url.searchParams.get('hostUserId')
      if (!hostUserId) return NextResponse.json({ error: 'hostUserId is required for admin listing' }, { status: 400 })
      const host = await prisma.host.findUnique({ where: { userId: hostUserId }, select: { id: true } })
      if (!host) return NextResponse.json({ error: 'Target host profile not found' }, { status: 400 })
      hostId = host.id
    }

    const requests = await prisma.competitionRequest.findMany({
      where: { hostId: hostId! },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ requests })
  } catch (error: any) {
    console.error('List competitions error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch competition requests' }, { status: 500 })
  }
}

// Submit a competition request (accepts FormData)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Host privileges required' }, { status: 403 })
    }

    const form = await request.formData()
    const name = String(form.get('name') || '')
    const startDate = String(form.get('startDate') || '')
    const endDate = String(form.get('endDate') || '')
    const venueId = String(form.get('venueId') || '')
    const description = String(form.get('description') || '')
    const expectedParticipants = String(form.get('expectedParticipants') || '')

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: 'name, startDate, endDate are required' }, { status: 400 })
    }

    let hostId: string | null = null
    if (user.role === 'HOST') {
      const host = await prisma.host.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!host) return NextResponse.json({ error: 'Host profile not found' }, { status: 400 })
      hostId = host.id
    } else {
      const hostUserId = String(form.get('hostUserId') || '')
      if (!hostUserId) return NextResponse.json({ error: 'hostUserId is required when creating as admin' }, { status: 400 })
      const host = await prisma.host.findUnique({ where: { userId: hostUserId }, select: { id: true } })
      if (!host) return NextResponse.json({ error: 'Target host profile not found' }, { status: 400 })
      hostId = host.id
    }

    const created = await prisma.competitionRequest.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        venueId: venueId || null,
        description: description || null,
        expectedParticipants: expectedParticipants ? parseInt(expectedParticipants, 10) : null,
        status: 'PENDING',
        hostId: hostId!,
      },
    })

    return NextResponse.json({ success: true, request: created }, { status: 201 })
  } catch (error: any) {
    console.error('Create competition error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to submit competition request' }, { status: 500 })
  }
}
