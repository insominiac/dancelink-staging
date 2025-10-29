import { FastifyInstance } from 'fastify'
import { getPrisma } from '../../lib/db.js'

export default async function adminBookings(instance: FastifyInstance) {
  // GET list with filters
  instance.get('/', async (request) => {
    const prisma = getPrisma()
    const q = (request.query || {}) as any
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.min(100, Number(q.limit) || 10)
    const status = String(q.status || '')
    const userId = String(q.userId || '')
    const classId = String(q.classId || '')
    const eventId = String(q.eventId || '')
    const skip = (page - 1) * limit

    const where: any = {
      ...(status ? { status } : {}),
      ...(userId ? { userId } : {}),
      ...(classId ? { classId } : {}),
      ...(eventId ? { eventId } : {}),
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          class: {
            include: {
              classInstructors: {
                include: { instructor: { include: { user: true } } },
              },
            },
          },
          event: { include: { venue: true } },
          transactions: true,
        },
      }),
      prisma.booking.count({ where }),
    ])

    return { bookings, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  })

  // POST create
  instance.post('/', async (request, reply) => {
    const prisma = getPrisma()
    const { userId, classId, eventId, status, amountPaid, paymentMethod, notes } = (request.body || {}) as any

    if (!classId && !eventId) {
      reply.code(400)
      return { error: 'Either classId or eventId must be provided' }
    }
    if (classId && eventId) {
      reply.code(400)
      return { error: 'Only one of classId or eventId should be provided' }
    }

    const existing = await prisma.booking.findFirst({ where: { userId, ...(classId ? { classId } : { eventId }) } })
    if (existing) {
      reply.code(400)
      return { error: 'User already has a booking for this class/event' }
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId,
        classId,
        eventId,
        status: status || 'PENDING',
        amountPaid: parseFloat(String(amountPaid)),
        paymentMethod,
        notes,
      },
      include: { user: true, class: true, event: true },
    })

    if (eventId && status === 'CONFIRMED') {
      await prisma.event.update({ where: { id: eventId }, data: { currentAttendees: { increment: 1 } } })
    }

    reply.code(201)
    return { message: 'Booking created successfully', booking: newBooking }
  })
}
