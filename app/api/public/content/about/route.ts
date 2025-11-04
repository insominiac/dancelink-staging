import { NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

export async function GET() {
  try {
    await ensureDbConnection()
    const rec = await prisma.aboutPageContent.findUnique({ where: { id: 'about' } })
    if (rec) return NextResponse.json(rec)
    return NextResponse.json({})
  } catch {
    return NextResponse.json({})
  }
}

export const revalidate = 0
