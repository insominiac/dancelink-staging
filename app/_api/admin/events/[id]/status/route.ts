import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'
import { EventStatus } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDbConnection()
    const { status } = await request.json()

    const allowed: string[] = ['DRAFT', 'PUBLISHED', 'CANCELLED']
    if (!status || !allowed.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Allowed: DRAFT, PUBLISHED, CANCELLED' },
        { status: 400 }
      )
    }

    const updated = await prisma.event.update({
      where: { id: params.id },
      data: { status: status as EventStatus },
    })

    return NextResponse.json({ message: 'Status updated', event: updated })
  } catch (error) {
    console.error('Error updating event status:', error)
    return NextResponse.json(
      { error: 'Failed to update event status' },
      { status: 500 }
    )
  }
}
