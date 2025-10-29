import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { requireAuth } from '@/app/lib/auth'

// Create a new venue for the current HOST user
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    // Only HOSTs (or ADMINs acting on behalf) can create venues
    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Host privileges required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      phone,
      websiteUrl,
    } = body || {}

    if (!name || !addressLine1 || !city || !state || !country || !postalCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Resolve host
    let host = null as null | { id: string }

    if (user.role === 'HOST') {
      host = await prisma.host.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!host) {
        return NextResponse.json({ error: 'Host profile not found' }, { status: 400 })
      }
    } else if (user.role === 'ADMIN') {
      // For admins, optionally allow specifying hostUserId to create for a host
      const { hostUserId } = body || {}
      if (!hostUserId) {
        return NextResponse.json({ error: 'hostUserId is required when creating as admin' }, { status: 400 })
      }
      host = await prisma.host.findUnique({ where: { userId: hostUserId }, select: { id: true } })
      if (!host) {
        return NextResponse.json({ error: 'Target host profile not found' }, { status: 400 })
      }
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        country,
        postalCode,
        phone: phone || null,
        websiteUrl: websiteUrl || null,
        hostId: host!.id,
        status: 'DRAFT',
      }
    })

    return NextResponse.json({ success: true, venue }, { status: 201 })
  } catch (error: any) {
    console.error('Create venue error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create venue' }, { status: 500 })
  }
}

// List venues for the current HOST
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

    const venues = await prisma.venue.findMany({
      where: { hostId: hostId! },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ venues })
  } catch (error: any) {
    console.error('List venues error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 })
  }
}
