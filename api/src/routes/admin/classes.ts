import { FastifyInstance } from 'fastify'
import { getPrisma } from '../../lib/db.js'

export default async function adminClasses(instance: FastifyInstance) {
  // GET all classes with filters and pagination
  instance.get('/', async (request) => {
    const prisma = getPrisma()
    const q = (request.query || {}) as any
    const page = Math.max(1, Number(q.page) || 1)
    const limit = Math.min(100, Number(q.limit) || 10)
    const search = String(q.search || '')
    const level = String(q.level || '')
    const isActiveParam = q.isActive

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
        level ? { level } : {},
        typeof isActiveParam !== 'undefined' && isActiveParam !== null
          ? { isActive: String(isActiveParam) === 'true' }
          : {},
      ],
    }

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          classInstructors: {
            include: {
              instructor: { include: { user: true } },
            },
          },
          classStyles: { include: { style: true } },
          _count: { select: { bookings: true } },
        },
      }),
      prisma.class.count({ where }),
    ])

    return {
      classes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  })

  // POST create a new class
  instance.post('/', async (request, reply) => {
    const prisma = getPrisma()
    const body = (request.body || {}) as any
    const {
      title,
      description,
      level,
      durationMins,
      maxCapacity,
      price,
      scheduleDays,
      scheduleTime,
      startDate,
      endDate,
      requirements,
      imageUrl,
      isActive,
      instructorIds,
      styleIds,
    } = body

    const newClass = await prisma.class.create({
      data: {
        title,
        description,
        level,
        durationMins: parseInt(String(durationMins)),
        maxCapacity: parseInt(String(maxCapacity)),
        price: parseFloat(String(price)),
        scheduleDays,
        scheduleTime,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        requirements,
        imageUrl,
        isActive: isActive !== false,
      },
    })

    if (Array.isArray(instructorIds) && instructorIds.length > 0) {
      await prisma.classInstructor.createMany({
        data: instructorIds.map((instructorId: string, index: number) => ({
          classId: newClass.id,
          instructorId,
          isPrimary: index === 0,
        })),
      })
    }

    if (Array.isArray(styleIds) && styleIds.length > 0) {
      await prisma.classStyle.createMany({
        data: styleIds.map((styleId: string) => ({ classId: newClass.id, styleId })),
      })
    }

    const completeClass = await prisma.class.findUnique({
      where: { id: newClass.id },
      include: {
        classInstructors: {
          include: { instructor: { include: { user: true } } },
        },
        classStyles: { include: { style: true } },
      },
    })

    reply.code(201)
    return { message: 'Class created successfully', class: completeClass }
  })
}
