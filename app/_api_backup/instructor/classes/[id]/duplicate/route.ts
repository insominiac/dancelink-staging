import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { classIdSchema, instructorIdSchema } from '@/app/lib/validations'

const bodySchema = z.object({ instructorId: instructorIdSchema })

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const classId = classIdSchema.parse(params.id)
    const { instructorId } = bodySchema.parse(await request.json())

    const owns = await prisma.class.count({ where: { id: classId, classInstructors: { some: { instructorId } } } })
    if (!owns) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

    const orig = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        classStyles: { select: { styleId: true } },
        classInstructors: { select: { instructorId: true, isPrimary: true } },
      },
    })
    if (!orig) return NextResponse.json({ error: 'Class not found' }, { status: 404 })

    const created = await prisma.class.create({
      data: {
        title: `${orig.title} (Copy)`,
        description: (orig as any).description || '',
        level: (orig as any).level || 'General',
        durationMins: (orig as any).durationMins || 60,
        maxCapacity: (orig as any).maxCapacity || 20,
        price: (orig as any).price || 0,
        scheduleTime: (orig as any).scheduleTime || null,
        startDate: null,
        endDate: null,
        isActive: false,
        classInstructors: {
          create: orig.classInstructors.map((ci) => ({ instructorId: ci.instructorId, isPrimary: ci.isPrimary })),
        },
        classStyles: {
          create: orig.classStyles.map((cs) => ({ style: { connect: { id: cs.styleId } } })),
        },
      },
    })

    return NextResponse.json({ success: true, class: created })
  } catch (error) {
    console.error('Duplicate class error:', error)
    return NextResponse.json({ error: 'Failed to duplicate class' }, { status: 500 })
  }
}