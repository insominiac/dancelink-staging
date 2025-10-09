import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { classIdSchema, instructorIdSchema } from '@/app/lib/validations'

const getQuerySchema = z.object({
  instructorId: instructorIdSchema,
})

const postBodySchema = z.object({
  instructorId: instructorIdSchema,
  records: z.array(
    z.object({
      bookingId: z.string(),
      status: z.enum(['present', 'absent']),
    })
  ).min(1)
})

function parseAttendanceFromNotes(notes: string | null | undefined): 'present' | 'absent' | null {
  if (!notes) return null
  const match = notes.match(/\[ATTN:(present|absent)\]/)
  return match ? (match[1] as 'present' | 'absent') : null
}

function setAttendanceInNotes(existing: string | null | undefined, status: 'present' | 'absent'): string {
  const base = existing || ''
  // Remove previous attendance tag if exists
  const cleaned = base.replace(/\s*\[ATTN:(present|absent)\]\s*/g, '').trim()
  const appended = cleaned.length ? `${cleaned} [ATTN:${status}]` : `[ATTN:${status}]`
  return appended
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const classId = classIdSchema.parse(params.id)
    const { searchParams } = new URL(request.url)
    const { instructorId } = getQuerySchema.parse(Object.fromEntries(searchParams))

    // Ownership check
    const owns = await prisma.class.count({ where: { id: classId, classInstructors: { some: { instructorId } } } })
    if (!owns) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const bookings = await prisma.booking.findMany({
      where: { classId, status: 'CONFIRMED' },
      select: {
        id: true,
        notes: true,
        user: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    const attendees = bookings.map((b) => ({
      bookingId: b.id,
      user: b.user,
      status: parseAttendanceFromNotes(b.notes) // can be null
    }))

    return NextResponse.json({ success: true, attendees })
  } catch (error) {
    console.error('Attendance GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const classId = classIdSchema.parse(params.id)
    const body = await request.json()
    const { instructorId, records } = postBodySchema.parse(body)

    // Ownership check
    const owns = await prisma.class.count({ where: { id: classId, classInstructors: { some: { instructorId } } } })
    if (!owns) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const bookingIds = records.map((r) => r.bookingId)
    const bookings = await prisma.booking.findMany({ where: { id: { in: bookingIds }, classId } })

    // Build a map for quick lookup
    const byId = new Map(bookings.map((b) => [b.id, b]))

    await Promise.all(
      records.map(async (r) => {
        const b = byId.get(r.bookingId)
        if (!b) return
        const newNotes = setAttendanceInNotes((b as any).notes || null, r.status)
        await prisma.booking.update({ where: { id: r.bookingId }, data: { notes: newNotes } })
      })
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Attendance POST error:', error)
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 })
  }
}