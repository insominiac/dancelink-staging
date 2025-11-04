import { NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

export async function GET() {
  try {
    await ensureDbConnection()
    const rec = await prisma.contactPageContent.findUnique({ where: { id: 'contact' } })
    if (rec) return NextResponse.json({ content: rec })
    return NextResponse.json({ content: null })
  } catch {
    return NextResponse.json({ content: null })
  }
}

export const revalidate = 0
