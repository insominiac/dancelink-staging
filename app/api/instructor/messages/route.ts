import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema } from '@/app/lib/validations'

const bodySchema = z.object({
  instructorId: instructorIdSchema,
  recipientUserIds: z.array(z.string()).min(1),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const { instructorId, recipientUserIds, subject, body } = bodySchema.parse(await request.json())

    // Validate that each recipient has at least one booking with this instructor
    const validStudents = await prisma.booking.findMany({
      where: {
        userId: { in: recipientUserIds },
        class: { classInstructors: { some: { instructorId } } },
      },
      select: { userId: true },
      distinct: ['userId'],
    })

    const validSet = new Set(validStudents.map((b) => b.userId))
    const invalid = recipientUserIds.filter((id) => !validSet.has(id))
    if (invalid.length > 0) {
      return NextResponse.json({ error: 'Some recipients are not your students', invalid }, { status: 400 })
    }

    // Create notifications entries for each recipient
    const creations = recipientUserIds.map((uid) =>
      prisma.notification.create({
        data: {
          userId: uid,
          type: 'INSTRUCTOR_MESSAGE',
          title: subject,
          message: body,
          isRead: false,
          priority: 'normal',
        } as any,
      })
    )
    await Promise.all(creations)

    return NextResponse.json({ success: true, sent: recipientUserIds.length })
  } catch (error) {
    console.error('Instructor direct message error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid message', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}