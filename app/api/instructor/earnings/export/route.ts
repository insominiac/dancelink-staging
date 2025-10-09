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

    // Derive rows from payments and refunds similar to transactions endpoint
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] as any },
        paymentStatus: 'succeeded',
        createdAt: { gte: fromDate, lte: toDate },
        class: { classInstructors: { some: { instructorId } } },
      },
      include: {
        class: { include: { classInstructors: true } },
        user: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const payments = bookings.map((b) => {
      const count = (b.class as any)?.classInstructors?.length || 1
      const share = 1 / Math.max(1, count)
      const amount = Number((b as any).amountPaid || 0) * share
      return { date: (b as any).createdAt?.toISOString?.() || new Date().toISOString(), type: 'PAYMENT', status: 'SUCCEEDED', amount, student: b.user?.fullName || '', email: b.user?.email || '', classTitle: (b.class as any)?.title || '' }
    })

    const refunds = await prisma.transaction.findMany({
      where: {
        type: 'REFUND' as any,
        createdAt: { gte: fromDate, lte: toDate },
        booking: { class: { classInstructors: { some: { instructorId } } } },
      },
      include: {
        booking: {
          include: {
            class: { include: { classInstructors: true } },
            user: { select: { fullName: true, email: true } }
          }
        }
      }
    })

    const refundRows = refunds.map((t) => {
      const count = (t.booking?.class as any)?.classInstructors?.length || 1
      const share = 1 / Math.max(1, count)
      const amount = -Number((t as any).amount || 0) * share
      return { date: (t as any).createdAt?.toISOString?.() || new Date().toISOString(), type: 'REFUND', status: (t as any).status || 'SUCCEEDED', amount, student: t.booking?.user?.fullName || '', email: t.booking?.user?.email || '', classTitle: (t.booking?.class as any)?.title || '' }
    })

    const rows = [...payments, ...refundRows].sort((a,b) => a.date.localeCompare(b.date))

    let csv = 'Date,Type,Status,Amount,Student,Email,Class\n'
    for (const r of rows) {
      csv += `${r.date},${r.type},${r.status},${r.amount.toFixed(2)},${JSON.stringify(r.student)},${JSON.stringify(r.email)},${JSON.stringify(r.classTitle)}\n`
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="earnings.csv"',
      },
    })
  } catch (error) {
    console.error('Instructor earnings export error:', error)
    return NextResponse.json({ error: 'Failed to export earnings' }, { status: 500 })
  }
}