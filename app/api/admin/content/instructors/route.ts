import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

const ID = 'instructors'

export async function GET() {
  try {
    await ensureDbConnection()
    const rec = await prisma.instructorsPageContent.findUnique({ where: { id: ID } })
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
    const saved = await prisma.instructorsPageContent.upsert({
      where: { id: ID },
      update: {
        heroBadgeText: content.heroBadgeText ?? null,
        heroTitle: content.heroTitle ?? null,
        heroSubtitle: content.heroSubtitle ?? null,
        statsSection: content.statsSection ?? null,
        noInstructorsSection: content.noInstructorsSection ?? null,
        errorSection: content.errorSection ?? null,
        ctaSection: content.ctaSection ?? null,
      },
      create: {
        id: ID,
        heroBadgeText: content.heroBadgeText ?? null,
        heroTitle: content.heroTitle ?? null,
        heroSubtitle: content.heroSubtitle ?? null,
        statsSection: content.statsSection ?? null,
        noInstructorsSection: content.noInstructorsSection ?? null,
        errorSection: content.errorSection ?? null,
        ctaSection: content.ctaSection ?? null,
      },
    })
    return NextResponse.json({ success: true, updatedAt: saved.updatedAt })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
