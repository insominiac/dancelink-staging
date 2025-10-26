import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema } from '@/app/lib/validations'

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

const listQuerySchema = z.object({
  instructorId: instructorIdSchema,
  status: z.enum(['all', 'active', 'inactive']).default('all').optional(),
  search: z.string().trim().min(1).max(100).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).merge(paginationSchema)

const createClassSchema = z.object({
  instructorId: instructorIdSchema,
  title: z.string().min(3).max(200),
  description: z.string().min(1).max(5000),
  level: z.string().min(1).max(100),
  durationMins: z.number().int().positive().max(1000),
  maxCapacity: z.number().int().positive().max(10000),
  price: z.number().nonnegative(),
  scheduleTime: z.string().min(1).max(20).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  venueId: z.string().optional(), // optional for now
  styleIds: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = listQuerySchema.safeParse(Object.fromEntries(searchParams))
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query params', details: parsed.error.flatten() }, { status: 400 })
    }

    const { instructorId, status, search, page, pageSize, startDate, endDate } = parsed.data

    const where: any = {
      classInstructors: { some: { instructorId } },
    }

    if (status === 'active') where.isActive = true
    if (status === 'inactive') where.isActive = false

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (startDate || endDate) {
      where.startDate = {}
      if (startDate) where.startDate.gte = new Date(startDate)
      if (endDate) where.startDate.lte = new Date(endDate)
    }

    const [total, classes] = await Promise.all([
      prisma.class.count({ where }),
      prisma.class.findMany({
        where,
        include: {
          venue: { select: { name: true, city: true } },
          bookings: { where: { status: 'CONFIRMED' }, select: { id: true } },
          classStyles: { include: { style: { select: { name: true, id: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    const items = classes.map((c) => ({
      id: c.id,
      title: c.title,
      level: (c as any).level,
      isActive: c.isActive,
      startDate: (c as any).startDate ? (c as any).startDate.toISOString() : null,
      scheduleTime: (c as any).scheduleTime || null,
      durationMins: (c as any).durationMins || null,
      venue: c.venue ? `${c.venue.name}${c.venue.city ? `, ${c.venue.city}` : ''}` : 'TBD',
      enrolled: c.bookings.length,
      capacity: (c as any).maxCapacity || 0,
      styles: (c.classStyles || []).map((cs: any) => cs.style.name),
    }))

    return NextResponse.json({ success: true, page, pageSize, total, items })
  } catch (error) {
    console.error('Instructor classes list error:', error)
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const parsed = createClassSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
    }

    const {
      instructorId,
      title,
      description,
      level,
      durationMins,
      maxCapacity,
      price,
      scheduleTime,
      startDate,
      endDate,
      venueId,
      styleIds,
    } = parsed.data

    // Ensure instructor exists
    const instructor = await prisma.instructor.findUnique({ where: { id: instructorId } })
    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }

    const created = await prisma.class.create({
      data: {
        title,
        description,
        level,
        durationMins,
        maxCapacity,
        price,
        scheduleTime: scheduleTime || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: false, // default to draft
        ...(venueId ? { venue: { connect: { id: venueId } } } : {}),
        classInstructors: {
          create: [{ instructorId, isPrimary: true }],
        },
        ...(styleIds && styleIds.length
          ? {
              classStyles: {
                create: styleIds.map((sid) => ({ style: { connect: { id: sid } } })),
              },
            }
          : {}),
      },
      include: {
        classInstructors: true,
        classStyles: true,
      },
    })

    return NextResponse.json({ success: true, class: created }, { status: 201 })
  } catch (error) {
    console.error('Instructor create class error:', error)
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}