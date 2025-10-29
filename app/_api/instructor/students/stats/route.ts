import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema } from '@/app/lib/validations'

const querySchema = z.object({ instructorId: instructorIdSchema })

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { instructorId } = querySchema.parse(Object.fromEntries(searchParams))

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [allDistinct, monthDistinct] = await Promise.all([
      prisma.booking.findMany({
        where: {
          class: { classInstructors: { some: { instructorId } } },
          status: { in: ['CONFIRMED', 'COMPLETED'] as any },
        },
        select: { userId: true },
        distinct: ['userId'],
      }),
      prisma.booking.findMany({
        where: {
          class: { classInstructors: { some: { instructorId } } },
          status: { in: ['CONFIRMED', 'COMPLETED'] as any },
          createdAt: { gte: startOfMonth },
        },
        select: { userId: true },
        distinct: ['userId'],
      }),
    ])

    return NextResponse.json({ success: true, total: allDistinct.length, thisMonth: monthDistinct.length })
  } catch (error) {
    console.error('Instructor student stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch student stats' }, { status: 500 })
  }
}