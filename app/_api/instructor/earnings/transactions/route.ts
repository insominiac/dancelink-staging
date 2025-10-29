import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { z } from 'zod'
import { instructorIdSchema } from '@/app/lib/validations'

const querySchema = z.object({
  instructorId: instructorIdSchema,
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  type: z.enum(['PAYMENT','REFUND','ALL']).default('ALL').optional(),
})

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfDay(d: Date) { const e = new Date(d); e.setHours(23,59,59,999); return e }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { instructorId, from, to, page, pageSize, type } = querySchema.parse(Object.fromEntries(searchParams))

    const now = new Date()
    const fromDate = from ? new Date(from) : startOfMonth(now)
    const toDate = to ? new Date(to) : endOfDay(now)

    // Payments are derived from bookings with succeeded payments
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] as any },
        paymentStatus: 'succeeded',
        createdAt: { gte: fromDate, lte: toDate },
        class: { classInstructors: { some: { instructorId } } },
      },
      include: {
        class: { include: { classInstructors: true } },
        user: { select: { id: true, fullName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
    })

    const payments = bookings.map((b) => {
      const count = (b.class as any)?.classInstructors?.length || 1
      const share = 1 / Math.max(1, count)
      const amount = Number((b as any).amountPaid || 0) * share
      return {
        id: `PAY-${b.id}`,
        date: (b as any).createdAt?.toISOString?.() || new Date().toISOString(),
        type: 'PAYMENT',
        status: 'SUCCEEDED',
        amount,
        student: b.user?.fullName || 'Student',
        classTitle: (b.class as any)?.title || 'Class',
      }
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
            user: { select: { id: true, fullName: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    const refundRows = refunds.map((t) => {
      const count = (t.booking?.class as any)?.classInstructors?.length || 1
      const share = 1 / Math.max(1, count)
      return {
        id: `REF-${t.id}`,
        date: (t as any).createdAt?.toISOString?.() || new Date().toISOString(),
        type: 'REFUND',
        status: (t as any).status || 'SUCCEEDED',
        amount: -Number((t as any).amount || 0) * share,
        student: t.booking?.user?.fullName || 'Student',
        classTitle: (t.booking?.class as any)?.title || 'Class',
      }
    })

    let rows = [...payments, ...refundRows]
    if (type && type !== 'ALL') rows = rows.filter((r) => r.type === type)

    const total = rows.length
    const start = (page - 1) * pageSize
    const end = Math.min(total, start + pageSize)
    const items = rows.slice(start, end)

    return NextResponse.json({ success: true, page, pageSize, total, items })
  } catch (error) {
    console.error('Instructor earnings transactions error:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}