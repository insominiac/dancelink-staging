import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { classIdSchema, instructorIdSchema } from '@/app/lib/validations'

const idParamSchema = z.object({ id: classIdSchema })

const getQuerySchema = z.object({ instructorId: instructorIdSchema.optional() })

const updateSchema = z.object({
  instructorId: instructorIdSchema, // used for ownership check
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  level: z.string().min(1).max(100).optional(),
  durationMins: z.number().int().positive().max(1000).optional(),
  maxCapacity: z.number().int().positive().max(10000).optional(),
  price: z.number().nonnegative().optional(),
  scheduleTime: z.string().min(1).max(20).nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  venueId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  styleIds: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = idParamSchema.parse(params)
    const { searchParams } = new URL(request.url)
    const { instructorId } = getQuerySchema.parse(Object.fromEntries(searchParams))

    // Optional ownership check if instructorId provided
    const where: any = { id }
    if (instructorId) {
      where.classInstructors = { some: { instructorId } }
    }

    const cls = await prisma.class.findFirst({
      where,
      include: {
        venue: { select: { id: true, name: true, city: true } },
        classInstructors: { include: { instructor: { include: { user: { select: { fullName: true, email: true } } } } } },
        classStyles: { include: { style: { select: { id: true, name: true } } } },
        bookings: {
          where: { status: 'CONFIRMED' },
          include: { user: { select: { id: true, fullName: true, email: true } } },
        },
      },
    })

    if (!cls) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, class: cls })
  } catch (error) {
    console.error('Get instructor class error:', error)
    return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = idParamSchema.parse(params)
    const json = await request.json()
    const parsed = updateSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
    }

    const { instructorId, styleIds, venueId, startDate, endDate, ...rest } = parsed.data

    // Ownership check
    const owns = await prisma.class.count({
      where: { id, classInstructors: { some: { instructorId } } },
    })
    if (!owns) {
      return NextResponse.json({ error: 'Not authorized to modify this class' }, { status: 403 })
    }

    // Capacity guard: prevent lowering capacity below current confirmed enrollment
    if (typeof (rest as any).maxCapacity !== 'undefined') {
      const enrolled = await prisma.booking.count({ where: { classId: id, status: 'CONFIRMED' } })
      if (enrolled > (rest as any).maxCapacity) {
        return NextResponse.json(
          { error: `Capacity (${(rest as any).maxCapacity}) cannot be less than current enrolled (${enrolled}).` },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.class.update({
      where: { id },
      data: {
        ...(rest as any),
        ...(typeof venueId !== 'undefined'
          ? venueId
            ? { venue: { connect: { id: venueId } } }
            : { venue: { disconnect: true } }
          : {}),
        ...(typeof startDate !== 'undefined' ? { startDate: startDate ? new Date(startDate) : null } : {}),
        ...(typeof endDate !== 'undefined' ? { endDate: endDate ? new Date(endDate) : null } : {}),
        ...(styleIds
          ? {
              classStyles: {
                deleteMany: {},
                create: styleIds.map((sid) => ({ style: { connect: { id: sid } } })),
              },
            }
          : {}),
      },
      include: { classStyles: true },
    })

    return NextResponse.json({ success: true, class: updated })
  } catch (error) {
    console.error('Update instructor class error:', error)
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = idParamSchema.parse(params)
    const body = await request.json().catch(() => ({}))
    const instructorId = body?.instructorId as string | undefined

    if (!instructorId) {
      return NextResponse.json({ error: 'instructorId required' }, { status: 400 })
    }

    const owns = await prisma.class.count({ where: { id, classInstructors: { some: { instructorId } } } })
    if (!owns) {
      return NextResponse.json({ error: 'Not authorized to delete this class' }, { status: 403 })
    }

    // Prevent deletion if there are confirmed bookings
    const confirmed = await prisma.booking.count({ where: { classId: id, status: 'CONFIRMED' } })
    if (confirmed > 0) {
      return NextResponse.json({ error: 'Cannot delete a class with confirmed bookings' }, { status: 409 })
    }

    await prisma.class.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete instructor class error:', error)
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 })
  }
}