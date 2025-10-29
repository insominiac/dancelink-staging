import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

// List academies for current host
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

    const academies = await prisma.academy.findMany({
      where: { hostId: hostId! },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ academies })
  } catch (error: any) {
    console.error('List academies error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch academies' }, { status: 500 })
  }
}

// Submit academy for approval
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Host privileges required' }, { status: 403 })
    }

    const form = await request.formData()
    const name = String(form.get('name') || '')
    const description = String(form.get('description') || '')
    const website = String(form.get('website') || '')
    const city = String(form.get('city') || '')
    const country = String(form.get('country') || '')

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
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

    const created = await prisma.academy.create({
      data: {
        name,
        description: description || null,
        website: website || null,
        city: city || null,
        country: country || null,
        logoUrl: null,
        status: 'PENDING_APPROVAL',
        hostId: hostId!,
      },
    })

    return NextResponse.json({ success: true, academy: created }, { status: 201 })
  } catch (error: any) {
    console.error('Create academy error:', error)
    if (error?.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to submit academy' }, { status: 500 })
  }
}
