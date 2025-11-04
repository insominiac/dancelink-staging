import { NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

export async function GET() {
  try {
    await ensureDbConnection()
    const rec = await prisma.eventsPageContent.findUnique({ where: { id: 'events' } })
    if (!rec) return NextResponse.json({})
    return NextResponse.json({
      heroBadgeText: rec.heroBadgeText,
      heroTitle: rec.heroTitle,
      heroSubtitle: rec.heroSubtitle,
      featuredTitle: rec.featuredTitle,
      featuredDescription: rec.featuredDescription,
      searchTitle: rec.searchTitle,
      searchDescription: rec.searchDescription,
      ctaBadgeText: rec.ctaBadgeText,
      ctaTitle: rec.ctaTitle,
      ctaDescription: rec.ctaDescription,
      heroFeatures: rec.heroFeatures,
      ctaButtons: rec.ctaButtons,
      ctaFeatures: rec.ctaFeatures,
    })
  } catch {
    return NextResponse.json({})
  }
}

export const revalidate = 0
