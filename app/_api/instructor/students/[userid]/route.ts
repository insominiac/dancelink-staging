import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema, userIdSchema } from '@/app/lib/validations'

const querySchema = z.object({ instructorId: instructorIdSchema })

function parseAttendanceFromNotes(notes: string | null | undefined): 'present' | 'absent' | null {
  if (!notes) return null
  const m = notes.match(/\[ATTN:(present|absent)\]/i)
  return m ? (m[1].toLowerCase() as 'present' | 'absent') : null
}

function parseLatestInstructorNote(instructorId: string, notesList: (string | null)[]): string | null {
  const tag = `NOTE:${instructorId}:`
  for (const notes of notesList) {
    if (!notes) continue
    const m = notes.match(new RegExp(`\\[${tag}([A-Za-z0-9+/=]+)\\]`))
    if (m) {
      try { return Buffer.from(m[1], 'base64').toString('utf8') } catch {}
    }
  }
  return null
}

export async function GET(request: NextRequest, { params }: { params: { userid: string } }) {
  try {
    const userId = userIdSchema.parse(params.userid)
    const { searchParams } = new URL(request.url)
    const { instructorId } = querySchema.parse(Object.fromEntries(searchParams))

    const [user, bookings] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, fullName: true, email: true } }),
      prisma.booking.findMany({
        where: {
          userId,
          class: { classInstructors: { some: { instructorId } } },
        },
        include: {
          class: { select: { id: true, title: true, startDate: true, scheduleTime: true, venue: { select: { name: true, city: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    if (!user) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

    // Attendance summary
    let present = 0, absent = 0
    const notesList: (string | null)[] = []
    for (const b of bookings) {
      notesList.push((b as any).notes || null)
      const att = parseAttendanceFromNotes((b as any).notes)
      if (att === 'present') present++
      else if (att === 'absent') absent++
    }
    const attendanceRate = present + absent ? present / (present + absent) : null
    const latestNote = parseLatestInstructorNote(instructorId, notesList)

    const data = {
      student: { id: user.id, name: user.fullName, email: user.email },
      summary: { totalBookings: bookings.length, present, absent, attendanceRate, latestNote },
      bookings: bookings.map((b) => ({
        id: b.id,
        classId: b.class?.id,
        classTitle: b.class?.title,
        date: (b as any).createdAt?.toISOString?.() || null,
        startDate: b.class?.startDate?.toISOString?.() || null,
        time: (b.class as any)?.scheduleTime || null,
        venue: b.class?.venue ? `${b.class.venue.name}${b.class.venue.city ? ', ' + b.class.venue.city : ''}` : 'TBD',
        status: (b as any).status,
      })),
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Instructor student details error:', error)
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 })
  }
}