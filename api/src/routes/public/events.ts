import { FastifyInstance } from 'fastify'
import { getPrisma, ensureDbConnection } from '../../lib/db.js'

export default async function publicEvents(instance: FastifyInstance) {
  // GET published future/ongoing events
  instance.get('/events', async (request, reply) => {
    try {
      await ensureDbConnection()
      const prisma = getPrisma()

      const events = await prisma.event.findMany({
        where: { status: 'PUBLISHED', endDate: { gte: new Date() } },
        include: {
          venue: { select: { id: true, name: true, city: true, addressLine1: true, addressLine2: true } },
          eventStyles: { include: { style: true } },
          _count: { select: { bookings: { where: { status: { in: ['CONFIRMED', 'COMPLETED'] } } } } },
        },
        orderBy: [{ isFeatured: 'desc' }, { startDate: 'asc' }],
      })

      const eventsWithCounts = await Promise.all(
        events.map(async (ev: any) => {
          let activeLocks = 0
          try {
            const seatLockModel = (prisma as any).seatLock
            if (seatLockModel?.count) {
              activeLocks = await seatLockModel.count({
                where: { itemType: 'EVENT', itemId: ev.id, status: 'ACTIVE', expiresAt: { gt: new Date() } },
              })
            }
          } catch {}
          const bookingsCount = ev?._count?.bookings ?? 0
          return { ...ev, currentAttendees: bookingsCount + activeLocks }
        })
      )

      return { events: eventsWithCounts, total: eventsWithCounts.length }
    } catch (e) {
      reply.code(500)
      return { error: 'Failed to fetch events' }
    }
  })

  // GET event by id (published only)
  instance.get('/events/:id', async (request, reply) => {
    try {
      const prisma = getPrisma()
      const { id } = request.params as any
      const eventData = await prisma.event.findUnique({
        where: { id, status: 'PUBLISHED' as any },
        include: {
          venue: { select: { id: true, name: true, city: true, addressLine1: true, addressLine2: true } },
          eventStyles: { include: { style: { select: { id: true, name: true, category: true } } } },
          _count: { select: { bookings: { where: { status: { in: ['CONFIRMED', 'COMPLETED'] } } } } },
        },
      })
      if (!eventData) {
        reply.code(404)
        return { error: 'Event not found' }
      }

      let activeLocks = 0
      try {
        const seatLockModel = (prisma as any).seatLock
        if (seatLockModel?.count) {
          activeLocks = await seatLockModel.count({
            where: { itemType: 'EVENT', itemId: id, status: 'ACTIVE', expiresAt: { gt: new Date() } },
          })
        }
      } catch {}
      const eventWithAttendeeCount = { ...eventData, currentAttendees: ((eventData as any)?._count?.bookings ?? 0) + activeLocks }
      return { event: eventWithAttendeeCount }
    } catch (e) {
      reply.code(500)
      return { error: 'Failed to fetch event details' }
    }
  })
}
