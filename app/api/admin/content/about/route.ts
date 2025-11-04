import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

const ID = 'about'

export async function GET() {
  try {
    await ensureDbConnection()
    const rec = await prisma.aboutPageContent.findUnique({ where: { id: ID } })
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
    const saved = await prisma.aboutPageContent.upsert({
      where: { id: ID },
      update: {
        heroTitle: body.heroTitle ?? null,
        heroSubtitle: body.heroSubtitle ?? null,
        heroBadgeText: body.heroBadgeText ?? null,
        statsTitle: body.statsTitle ?? null,
        statsDescription: body.statsDescription ?? null,
        storyTitle: body.storyTitle ?? null,
        storyDescription1: body.storyDescription1 ?? null,
        storyDescription2: body.storyDescription2 ?? null,
        whyChooseUsTitle: body.whyChooseUsTitle ?? null,
        heroFeatures: body.heroFeatures ?? null,
        stats: body.stats ?? null,
        features: body.features ?? null,
        newsletterTitle: body.newsletterTitle ?? null,
        newsletterDescription: body.newsletterDescription ?? null,
        newsletterBenefits: body.newsletterBenefits ?? null,
        ctaTitle: body.ctaTitle ?? null,
        ctaDescription: body.ctaDescription ?? null,
        ctaBadgeText: body.ctaBadgeText ?? null,
        ctaButtons: body.ctaButtons ?? null,
        ctaFeatures: body.ctaFeatures ?? null,
      },
      create: {
        id: ID,
        heroTitle: body.heroTitle ?? '',
        heroSubtitle: body.heroSubtitle ?? '',
        heroBadgeText: body.heroBadgeText ?? null,
        statsTitle: body.statsTitle ?? null,
        statsDescription: body.statsDescription ?? null,
        storyTitle: body.storyTitle ?? null,
        storyDescription1: body.storyDescription1 ?? null,
        storyDescription2: body.storyDescription2 ?? null,
        whyChooseUsTitle: body.whyChooseUsTitle ?? null,
        heroFeatures: body.heroFeatures ?? null,
        stats: body.stats ?? null,
        features: body.features ?? null,
        newsletterTitle: body.newsletterTitle ?? null,
        newsletterDescription: body.newsletterDescription ?? null,
        newsletterBenefits: body.newsletterBenefits ?? null,
        ctaTitle: body.ctaTitle ?? null,
        ctaDescription: body.ctaDescription ?? null,
        ctaBadgeText: body.ctaBadgeText ?? null,
        ctaButtons: body.ctaButtons ?? null,
        ctaFeatures: body.ctaFeatures ?? null,
      },
    })
    return NextResponse.json({ success: true, updatedAt: saved.updatedAt })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
