import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema } from '@/app/lib/validations'

const querySchema = z.object({
  instructorId: instructorIdSchema,
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfDay(d: Date) { const e = new Date(d); e.setHours(23,59,59,999); return e }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { instructorId, from, to } = querySchema.parse(Object.fromEntries(searchParams))

    const now = new Date()
    const fromDate = from ? new Date(from) : startOfMonth(now)
    const toDate = to ? new Date(to) : endOfDay(now)

    // Fetch bookings with succeeded payments within range and relevant to instructor
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] as any },
        paymentStatus: 'succeeded',
        createdAt: { gte: fromDate, lte: toDate },
        class: { classInstructors: { some: { instructorId } } },
      },
      include: {
        class: { include: { classInstructors: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    const gross = bookings.reduce((sum, b) => {
      const share = 1 / Math.max(1, (b.class as any)?.classInstructors?.length || 1)
      return sum + Number((b as any).amountPaid || 0) * share
    }, 0)

    // Refunds from transactions
    const refunds = await prisma.transaction.findMany({
      where: {
        type: 'REFUND' as any,
        createdAt: { gte: fromDate, lte: toDate },
        booking: { class: { classInstructors: { some: { instructorId } } } },
      },
      include: { booking: { include: { class: { include: { classInstructors: true } } } } },
    })

    const refundTotal = refunds.reduce((sum, t) => {
      const count = (t.booking?.class as any)?.classInstructors?.length || 1
      const share = 1 / Math.max(1, count)
      return sum + Number((t as any).amount || 0) * share
    }, 0)

    const net = gross - refundTotal

    // Trend by day
    const dayKey = (d: Date) => d.toISOString().slice(0,10)
    const trendMap = new Map<string, number>()
    for (const b of bookings) {
      const k = dayKey((b as any).createdAt as Date)
      const share = 1 / Math.max(1, (b.class as any)?.classInstructors?.length || 1)
      const val = Number((b as any).amountPaid || 0) * share
      trendMap.set(k, (trendMap.get(k) || 0) + val)
    }
    for (const t of refunds) {
      const k = dayKey((t as any).createdAt as Date)
      const count = (t.booking?.class as any)?.classInstructors?.length || 1
      const share = 1 / Math.max(1, count)
      const val = Number((t as any).amount || 0) * share
      trendMap.set(k, (trendMap.get(k) || 0) - val)
    }

    const trend = Array.from(trendMap.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([date, value]) => ({ date, value }))

    return NextResponse.json({ success: true, range: { from: fromDate.toISOString(), to: toDate.toISOString() }, totals: { gross, refunds: refundTotal, net }, trend })
  } catch (error) {
    console.error('Instructor earnings summary error:', error)
    return NextResponse.json({ error: 'Failed to fetch earnings summary' }, { status: 500 })
  }
}