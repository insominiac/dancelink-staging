import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema, userIdSchema, classIdSchema } from '@/app/lib/validations'

const bodySchema = z.object({
  instructorId: instructorIdSchema,
  bookingId: z.string().optional(),
  classId: classIdSchema.optional(),
})

export async function POST(request: NextRequest, { params }: { params: { userid: string } }) {
  try {
    const userId = userIdSchema.parse(params.userid)
    const { instructorId, bookingId, classId } = bodySchema.parse(await request.json())

    if (!bookingId && !classId) return NextResponse.json({ error: 'bookingId or classId required' }, { status: 400 })

    const booking = await prisma.booking.findFirst({
      where: {
        userId,
        ...(bookingId ? { id: bookingId } : {}),
        ...(classId ? { classId } : {}),
        class: { classInstructors: { some: { instructorId } } },
        status: { in: ['CONFIRMED', 'PENDING'] as any },
      },
      include: { class: true },
    })

    if (!booking) return NextResponse.json({ error: 'Booking not found or not cancellable' }, { status: 404 })

    const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: 'CANCELLED' } })
    return NextResponse.json({ success: true, booking: updated })
  } catch (error) {
    console.error('Cancel student booking error:', error)
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }
}