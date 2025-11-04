import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

const ID = 'events'

export async function GET() {
  try {
    await ensureDbConnection()
    const rec = await prisma.eventsPageContent.findUnique({ where: { id: ID } })
    if (rec) return NextResponse.json(rec)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureDbConnection()
    const body = await req.json()
    const saved = await prisma.eventsPageContent.upsert({
      where: { id: ID },
      update: {
        heroBadgeText: body.heroBadgeText ?? null,
        heroTitle: body.heroTitle ?? null,
        heroSubtitle: body.heroSubtitle ?? null,
        featuredTitle: body.featuredTitle ?? null,
        featuredDescription: body.featuredDescription ?? null,
        searchTitle: body.searchTitle ?? null,
        searchDescription: body.searchDescription ?? null,
        ctaBadgeText: body.ctaBadgeText ?? null,
        ctaTitle: body.ctaTitle ?? null,
        ctaDescription: body.ctaDescription ?? null,
        heroFeatures: body.heroFeatures ?? null,
        ctaButtons: body.ctaButtons ?? null,
        ctaFeatures: body.ctaFeatures ?? null,
      },
      create: {
        id: ID,
        heroBadgeText: body.heroBadgeText ?? null,
        heroTitle: body.heroTitle ?? null,
        heroSubtitle: body.heroSubtitle ?? null,
        featuredTitle: body.featuredTitle ?? null,
        featuredDescription: body.featuredDescription ?? null,
        searchTitle: body.searchTitle ?? null,
        searchDescription: body.searchDescription ?? null,
        ctaBadgeText: body.ctaBadgeText ?? null,
        ctaTitle: body.ctaTitle ?? null,
        ctaDescription: body.ctaDescription ?? null,
        heroFeatures: body.heroFeatures ?? null,
        ctaButtons: body.ctaButtons ?? null,
        ctaFeatures: body.ctaFeatures ?? null,
      },
    })
    return NextResponse.json({ success: true, updatedAt: saved.updatedAt })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
