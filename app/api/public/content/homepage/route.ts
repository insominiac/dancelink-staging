import { NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

// Storage key for homepage content in SiteSettings
const CONTENT_KEY = 'homepage-content'

// Default homepage content
const DEFAULT_CONTENT = {
  heroTitle: 'Master the Art of Dance',
  heroSubtitle: 'Join our community of passionate dancers and experienced instructors',
  heroButtonText: 'Start Your Journey',
  heroBackgroundImage: '/images/hero-default.svg',
  aboutTitle: 'Why Choose Our Studio?',
  aboutDescription: 'We offer a wide range of dance classes for all skill levels, with expert instructors and a supportive community.',
  testimonialsEnabled: true,
  newsletterEnabled: true,
}

export async function GET() {
  try {
    await ensureDbConnection()
    // Prefer structured table (singleton row)
    const rec = await prisma.homepageContent.findUnique({ where: { id: 'homepage' } })
    if (rec) {
      return NextResponse.json({
        heroTitle: rec.heroTitle,
        heroSubtitle: rec.heroSubtitle,
        heroButtonText: rec.heroButtonText,
        heroBackgroundImage: rec.heroBackgroundImage,
        aboutTitle: rec.aboutTitle,
        aboutDescription: rec.aboutDescription,
        testimonialsEnabled: rec.testimonialsEnabled,
        newsletterEnabled: rec.newsletterEnabled,
      })
    }
    // Fallback to SiteSettings JSON if old data exists
    const latest = await prisma.siteSettings.findFirst({ orderBy: { createdAt: 'desc' } })
    const maybe = (latest?.footer as any)?.homepage
    if (maybe && typeof maybe === 'object') return NextResponse.json(maybe)
    return NextResponse.json(DEFAULT_CONTENT)
  } catch (e) {
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

// Revalidate quickly if statically cached somewhere (defensive)
export const revalidate = 0
