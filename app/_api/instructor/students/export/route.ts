import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema } from '@/app/lib/validations'

const querySchema = z.object({ instructorId: instructorIdSchema })

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { instructorId } = querySchema.parse(Object.fromEntries(searchParams))

    const distinctUserIds = await prisma.booking.findMany({
      where: { class: { classInstructors: { some: { instructorId } } }, status: { in: ['CONFIRMED', 'COMPLETED'] as any } },
      select: { userId: true },
      distinct: ['userId'],
    })

    const userIds = distinctUserIds.map((b) => b.userId)
    const users = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { fullName: true, email: true, id: true } })

    let csv = 'Name,Email,User ID\n'
    for (const u of users) {
      csv += `${JSON.stringify(u.fullName)},${JSON.stringify(u.email)},${JSON.stringify(u.id)}\n`
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="students.csv"',
      },
    })
  } catch (error) {
    console.error('Export students error:', error)
    return NextResponse.json({ error: 'Failed to export students' }, { status: 500 })
  }
}