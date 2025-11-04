import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

const HOMEPAGE_ID = 'homepage'

export async function GET() {
  try {
    await ensureDbConnection()
    const rec = await prisma.homepageContent.findUnique({ where: { id: HOMEPAGE_ID } })
    if (rec) return NextResponse.json(rec)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureDbConnection()
    const content = await req.json()
    if (!content || typeof content !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    const saved = await prisma.homepageContent.upsert({
      where: { id: HOMEPAGE_ID },
      update: {
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        heroButtonText: content.heroButtonText ?? null,
        heroBackgroundImage: content.heroBackgroundImage ?? null,
        aboutTitle: content.aboutTitle ?? null,
        aboutDescription: content.aboutDescription ?? null,
        testimonialsEnabled: content.testimonialsEnabled ?? true,
        newsletterEnabled: content.newsletterEnabled ?? true,
      },
      create: {
        id: HOMEPAGE_ID,
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        heroButtonText: content.heroButtonText ?? null,
        heroBackgroundImage: content.heroBackgroundImage ?? null,
        aboutTitle: content.aboutTitle ?? null,
        aboutDescription: content.aboutDescription ?? null,
        testimonialsEnabled: content.testimonialsEnabled ?? true,
        newsletterEnabled: content.newsletterEnabled ?? true,
      },
    })
    return NextResponse.json({ success: true, updatedAt: saved.updatedAt })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
