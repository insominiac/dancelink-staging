import { FastifyInstance } from 'fastify'
import { getPrisma } from '../../lib/db.js'

export default async function adminEvents(instance: FastifyInstance) {
  // GET list with filters
  instance.get('/', async (request) => {
    const prisma = getPrisma()
    const q = (request.query || {}) as any
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.min(100, Number(q.limit) || 10)
    const search = String(q.search || '')
    const status = String(q.status || '')
    const venueId = String(q.venueId || '')
    const skip = (page - 1) * limit

    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        status ? { status } : {},
        venueId ? { venueId } : {},
      ],
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          venue: true,
          organizer: true,
          eventStyles: { include: { style: true } },
          _count: { select: { bookings: true } },
        },
      }),
      prisma.event.count({ where }),
    ])

    return { events, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  })

  // POST create event
  instance.post('/', async (request, reply) => {
    const prisma = getPrisma()
    const body = (request.body || {}) as any
    const {
      title,
      description,
      eventType,
      startDate,
      endDate,
      startTime,
      endTime,
      venueId,
      price,
      maxAttendees,
      imageUrl,
      organizerUserId,
      status,
      isFeatured,
      styleIds,
    } = body

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        eventType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime,
        endTime,
        venueId,
        price: parseFloat(String(price)),
        maxAttendees: parseInt(String(maxAttendees)),
        currentAttendees: 0,
        imageUrl,
        organizerUserId,
        status: status || 'DRAFT',
        isFeatured: !!isFeatured,
      },
    })

    if (Array.isArray(styleIds) && styleIds.length > 0) {
      await prisma.eventStyle.createMany({
        data: styleIds.map((styleId: string) => ({ eventId: newEvent.id, styleId })),
      })
    }

    const complete = await prisma.event.findUnique({
      where: { id: newEvent.id },
      include: { venue: true, organizer: true, eventStyles: { include: { style: true } } },
    })

    reply.code(201)
    return { message: 'Event created successfully', event: complete }
  })

  // GET by id
  instance.get('/:id', async (request, reply) => {
    const prisma = getPrisma()
    const { id } = request.params as any
    const event = await prisma.event.findUnique({
      where: { id },
      include: { venue: true, organizer: true, eventStyles: { include: { style: true } }, _count: { select: { bookings: true } } },
    })
    if (!event) {
      reply.code(404)
      return { error: 'Event not found' }
    }
    return { event }
  })

  // PUT update
  instance.put('/:id', async (request) => {
    const prisma = getPrisma()
    const { id } = request.params as any
    const {
      title,
      description,
      eventType,
      startDate,
      endDate,
      startTime,
      endTime,
      venueId,
      price,
      maxAttendees,
      imageUrl,
      organizerUserId,
      status,
      isFeatured,
      styleIds,
    } = (request.body || {}) as any

    await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        eventType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime,
        endTime,
        venueId,
        price: parseFloat(String(price)),
        maxAttendees: parseInt(String(maxAttendees)),
        imageUrl,
        organizerUserId,
        status: status || 'DRAFT',
        isFeatured: !!isFeatured,
      },
    })

    if (styleIds !== undefined) {
      await prisma.eventStyle.deleteMany({ where: { eventId: id } })
      if (Array.isArray(styleIds) && styleIds.length > 0) {
        await prisma.eventStyle.createMany({ data: styleIds.map((styleId: string) => ({ eventId: id, styleId })) })
      }
    }

    const complete = await prisma.event.findUnique({
      where: { id },
      include: { venue: true, organizer: true, eventStyles: { include: { style: true } } },
    })
    return { message: 'Event updated successfully', event: complete }
  })

  // DELETE
  instance.delete('/:id', async (request, reply) => {
    const prisma = getPrisma()
    const { id } = request.params as any

    const existing = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    })
    if (!existing) {
      reply.code(404)
      return { error: 'Event not found' }
    }
    if ((existing as any)._count?.bookings > 0) {
      reply.code(400)
      return { error: 'Cannot delete event with confirmed bookings' }
    }
    await prisma.event.delete({ where: { id } })
    return { message: 'Event deleted successfully' }
  })
}
