import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const lock = await prisma.seatLock.findUnique({ where: { id } })
    if (!lock) {
      return NextResponse.json({ error: 'Lock not found' }, { status: 404 })
    }
    if (lock.status !== 'ACTIVE') {
      return NextResponse.json({ success: true })
    }
    await prisma.seatLock.update({ where: { id }, data: { status: 'RELEASED' as any, releasedAt: new Date() } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 })
  }
}