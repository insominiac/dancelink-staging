import prisma from '@/app/lib/db'

const ACTIVE_LOCK_WHERE = (itemType: 'CLASS'|'EVENT', itemId: string) => ({
  itemType,
  itemId,
  status: 'ACTIVE' as any,
  expiresAt: { gt: new Date() },
})

export async function getClassAvailability(classId: string) {
  const cls = await prisma.class.findUnique({ where: { id: classId } })
  if (!cls || !cls.isActive) return null
  const [confirmedBookings, activeLocks] = await Promise.all([
    prisma.booking.count({ where: { classId, status: { in: ['CONFIRMED','COMPLETED'] } } }),
    prisma.seatLock.count({ where: ACTIVE_LOCK_WHERE('CLASS', classId) as any }),
  ])
  const capacity = cls.maxCapacity
  const reserved = confirmedBookings + activeLocks
  const spotsLeft = Math.max(0, capacity - reserved)
  return { capacity, reserved, spotsLeft }
}

export async function getEventAvailability(eventId: string) {
  const ev = await prisma.event.findUnique({ where: { id: eventId } })
  if (!ev || ev.status !== 'PUBLISHED') return null
  const [confirmedBookings, activeLocks] = await Promise.all([
    prisma.booking.count({ where: { eventId, status: { in: ['CONFIRMED','COMPLETED'] } } }),
    prisma.seatLock.count({ where: ACTIVE_LOCK_WHERE('EVENT', eventId) as any }),
  ])
  const capacity = ev.maxAttendees
  const reserved = confirmedBookings + activeLocks
  const spotsLeft = Math.max(0, capacity - reserved)
  return { capacity, reserved, spotsLeft }
}