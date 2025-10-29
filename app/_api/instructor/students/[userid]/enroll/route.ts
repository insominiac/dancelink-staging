import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema, userIdSchema, classIdSchema } from '@/app/lib/validations'

const bodySchema = z.object({
  instructorId: instructorIdSchema,
  classId: classIdSchema,
})

export async function POST(request: NextRequest, { params }: { params: { userid: string } }) {
  try {
    const userId = userIdSchema.parse(params.userid)
    const { instructorId, classId } = bodySchema.parse(await request.json())

    // Verify class belongs to instructor
    const cls = await prisma.class.findFirst({ where: { id: classId, classInstructors: { some: { instructorId } } } })
    if (!cls) return NextResponse.json({ error: 'Class not found or not owned' }, { status: 404 })

    if (!cls.isActive) return NextResponse.json({ error: 'Cannot enroll into a draft class' }, { status: 400 })

    const confirmedCount = await prisma.booking.count({ where: { classId, status: 'CONFIRMED' } })
    const capacity = (cls as any).maxCapacity || 0
    if (capacity && confirmedCount >= capacity) {
      return NextResponse.json({ error: 'Class is at full capacity' }, { status: 409 })
    }

    // Prevent duplicate confirmed booking
    const existing = await prisma.booking.findFirst({ where: { classId, userId, status: 'CONFIRMED' } })
    if (existing) return NextResponse.json({ error: 'Student already enrolled' }, { status: 409 })

    const created = await prisma.booking.create({
      data: {
        userId,
        classId,
        status: 'CONFIRMED',
        totalAmount: Number((cls as any).price || 0),
        amountPaid: 0,
        paymentStatus: 'pending',
        confirmationCode: `ENR-${Date.now()}`,
      },
    })

    return NextResponse.json({ success: true, booking: created })
  } catch (error) {
    console.error('Enroll student error:', error)
    return NextResponse.json({ error: 'Failed to enroll student' }, { status: 500 })
  }
}