import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema, classIdSchema } from '@/app/lib/validations'

const bodySchema = z.object({
  instructorId: instructorIdSchema,
  classId: classIdSchema,
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const { instructorId, classId, subject, body } = bodySchema.parse(await request.json())

    // Ownership check
    const cls = await prisma.class.findFirst({ where: { id: classId, classInstructors: { some: { instructorId } } } })
    if (!cls) return NextResponse.json({ error: 'Class not found or not owned' }, { status: 404 })

    // Get confirmed students
    const bookings = await prisma.booking.findMany({
      where: { classId, status: 'CONFIRMED' },
      select: { userId: true },
      distinct: ['userId'],
    })
    const recipients = bookings.map((b) => b.userId)

    if (recipients.length === 0) return NextResponse.json({ success: true, sent: 0 })

    await Promise.all(
      recipients.map((uid) =>
        prisma.notification.create({
          data: {
            userId: uid,
            type: 'INSTRUCTOR_CLASS_ANNOUNCEMENT',
            title: subject,
            message: body,
            isRead: false,
            priority: 'normal',
          } as any,
        })
      )
    )

    return NextResponse.json({ success: true, sent: recipients.length })
  } catch (error) {
    console.error('Instructor class message error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid message', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to send class message' }, { status: 500 })
  }
}