import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

const ID = 'contact'

export async function GET() {
  try {
    await ensureDbConnection()
    const rec = await prisma.contactPageContent.findUnique({ where: { id: ID } })
    if (rec) return NextResponse.json({ content: rec })
    return NextResponse.json({ content: null })
  } catch {
    return NextResponse.json({ content: null }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureDbConnection()
    const body = await req.json()
    const content = body?.content ?? body
    const saved = await prisma.contactPageContent.upsert({
      where: { id: ID },
      update: {
        heroTitle: content.heroTitle ?? null,
        heroSubtitle: content.heroSubtitle ?? null,
        sections: content.sections ?? null,
      },
      create: {
        id: ID,
        heroTitle: content.heroTitle ?? null,
        heroSubtitle: content.heroSubtitle ?? null,
        sections: content.sections ?? null,
      },
    })
    return NextResponse.json({ success: true, updatedAt: saved.updatedAt })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
