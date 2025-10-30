import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema } from '@/app/lib/validations'

const listQuery = z.object({
  instructorId: instructorIdSchema,
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

function parseAttendanceFromNotes(notes: string | null | undefined): 'present' | 'absent' | null {
  if (!notes) return null
  const m = notes.match(/\[ATTN:(present|absent)\]/i)
  return m ? (m[1].toLowerCase() as 'present' | 'absent') : null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams)
    const { instructorId, search, page, pageSize } = listQuery.parse(params)

    // Find all distinct student IDs for this instructor (via class bookings)
    const whereBase = {
      class: {
        classInstructors: { some: { instructorId } },
      },
      status: { in: ['CONFIRMED', 'COMPLETED'] as any },
    } as const

    // optional text search applies to user fields; first collect userIds and then filter
    const distinctUserIds = await prisma.booking.findMany({
      where: whereBase,
      select: { userId: true },
      distinct: ['userId'],
      orderBy: { createdAt: 'desc' },
    })

    let userIds = distinctUserIds.map((b) => b.userId)

    // If search term provided, filter by user name/email
    if (search && search.trim()) {
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds },
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
        select: { id: true },
      })
      const searchIds = new Set(users.map((u) => u.id))
      userIds = userIds.filter((id) => searchIds.has(id))
    }

    const total = userIds.length
    const start = (page - 1) * pageSize
    const end = Math.min(start + pageSize, total)
    const pageUserIds = userIds.slice(start, end)

    // Fetch users and their bookings for this instructor in one go
    const [usersData, bookings] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: pageUserIds } },
        select: { id: true, fullName: true, email: true },
      }),
      prisma.booking.findMany({
        where: { ...whereBase, userId: { in: pageUserIds } },
        select: { id: true, userId: true, createdAt: true, notes: true },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // Aggregate per user
    const bookingsByUser = new Map<string, typeof bookings>()
    for (const b of bookings) {
      const list = bookingsByUser.get(b.userId) || []
      list.push(b)
      bookingsByUser.set(b.userId, list)
    }

    const items = usersData.map((u) => {
      const bs = bookingsByUser.get(u.id) || []
      const lastBooking = bs[0]
      let present = 0, absent = 0
      for (const b of bs) {
        const status = parseAttendanceFromNotes(b.notes as any)
        if (status === 'present') present++
        else if (status === 'absent') absent++
      }
      const totalAtt = present + absent
      const attendanceRate = totalAtt ? present / totalAtt : null
      return {
        id: u.id,
        name: u.fullName,
        email: u.email,
        totalBookings: bs.length,
        lastBookingAt: lastBooking?.createdAt?.toISOString() || null,
        attendanceRate,
      }
    })

    return NextResponse.json({ success: true, page, pageSize, total, items })
  } catch (error) {
    console.error('Instructor students list error:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}