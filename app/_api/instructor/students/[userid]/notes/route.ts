import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema, userIdSchema } from '@/app/lib/validations'

const bodySchema = z.object({
  instructorId: instructorIdSchema,
  note: z.string().max(2000),
})

function setInstructorNoteInNotes(instructorId: string, existing: string | null | undefined, note: string): string {
  const tag = `NOTE:${instructorId}:`
  const b64 = Buffer.from(note, 'utf8').toString('base64')
  const newTag = `[${tag}${b64}]`
  const base = existing || ''
  // Remove previous instructor note tag if present
  const cleaned = base.replace(new RegExp(`\\[${tag}[A-Za-z0-9+/=]+\\]`, 'g'), '').trim()
  return cleaned.length ? `${cleaned} ${newTag}` : newTag
}

export async function PATCH(request: NextRequest, { params }: { params: { userid: string } }) {
  try {
    const userId = userIdSchema.parse(params.userid)
    const { instructorId, note } = bodySchema.parse(await request.json())

    // Use the most recent booking between this instructor and student to store the note tag
    const booking = await prisma.booking.findFirst({
      where: {
        userId,
        class: { classInstructors: { some: { instructorId } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!booking) return NextResponse.json({ error: 'No relationship found to store note' }, { status: 404 })

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { notes: setInstructorNoteInNotes(instructorId, (booking as any).notes || null, note) },
      select: { id: true, notes: true },
    })

    return NextResponse.json({ success: true, storedOnBookingId: updated.id })
  } catch (error) {
    console.error('Save instructor note error:', error)
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 })
  }
}