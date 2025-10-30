import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { classIdSchema, instructorIdSchema } from '@/app/lib/validations'

const schema = z.object({
  instructorId: instructorIdSchema,
  isActive: z.boolean(),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const classId = classIdSchema.parse(params.id)
    const json = await request.json()
    const { instructorId, isActive } = schema.parse(json)

    const owns = await prisma.class.count({ where: { id: classId, classInstructors: { some: { instructorId } } } })
    if (!owns) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Basic publish validation: must have title, capacity, and scheduleTime
    const cls = await prisma.class.findUnique({ where: { id: classId } })
    if (!cls) return NextResponse.json({ error: 'Class not found' }, { status: 404 })

    if (isActive) {
      if (!cls.title || !(cls as any).maxCapacity || !(cls as any).scheduleTime) {
        return NextResponse.json({ error: 'Class missing required fields to publish' }, { status: 400 })
      }
    }

    const updated = await prisma.class.update({ where: { id: classId }, data: { isActive } })
    return NextResponse.json({ success: true, class: updated })
  } catch (error) {
    console.error('Publish toggle error:', error)
    return NextResponse.json({ error: 'Failed to update publish status' }, { status: 500 })
  }
}