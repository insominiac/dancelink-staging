import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

const DEFAULT_TTL_MINUTES = 15

export async function POST(request: NextRequest) {
  try {
    const { itemType, itemId, userId, quantity = 1, ttlMinutes } = await request.json()
    if (!itemType || !itemId) {
      return NextResponse.json({ error: 'itemType and itemId are required' }, { status: 400 })
    }
    if (!['CLASS','EVENT'].includes(itemType)) {
      return NextResponse.json({ error: 'Invalid itemType' }, { status: 400 })
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 60_000 * (ttlMinutes || DEFAULT_TTL_MINUTES))

    const result = await prisma.$transaction(async (tx) => {
      // Load capacity
      let capacity = 0
      if (itemType === 'CLASS') {
        const cls = await tx.class.findUnique({ where: { id: itemId } })
        if (!cls || !cls.isActive) throw new Error('Class not found or inactive')
        capacity = cls.maxCapacity
      } else {
        const ev = await tx.event.findUnique({ where: { id: itemId } })
        if (!ev || ev.status !== 'PUBLISHED') throw new Error('Event not found or not published')
        capacity = ev.maxAttendees
      }

      const [confirmed, locks] = await Promise.all([
        tx.booking.count({ where: { ...(itemType==='CLASS'?{classId:itemId}:{eventId:itemId}), status: { in: ['CONFIRMED','COMPLETED'] } } }),
        tx.seatLock.count({ where: { itemType, itemId, status: 'ACTIVE', expiresAt: { gt: now } } as any })
      ])

      if (confirmed + locks + quantity > capacity) {
        throw new Error('No seats available')
      }

      const lock = await tx.seatLock.create({
        data: { itemType: itemType as any, itemId, userId: userId || null, quantity, expiresAt }
      })

      return lock
    })

    return NextResponse.json({ success: true, lock: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 })
  }
}