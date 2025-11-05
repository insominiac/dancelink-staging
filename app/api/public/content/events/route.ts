import { NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

// Default events page content
const DEFAULT_CONTENT = {
  heroBadgeText: '🎉 Upcoming Events',
  heroTitle: 'Join Our Dance Events',
  heroSubtitle: 'Discover exciting workshops, competitions, and social gatherings in our dance community',
  featuredTitle: 'Featured Events',
  featuredDescription: 'Don\'t miss these special events curated just for you',
  searchTitle: 'Find Your Perfect Event',
  searchDescription: 'Browse through our upcoming events and find the perfect dance experience for you',
  ctaBadgeText: '🌟 Special Offer',
  ctaTitle: 'Ready to Dance?',
  ctaDescription: 'Join our community and experience the joy of dance with fellow enthusiasts',
  heroFeatures: [
    { icon: '🎭', text: 'Expert Instructors' },
    { icon: '💃', text: 'Variety of Styles' },
    { icon: '🎪', text: 'Fun Atmosphere' }
  ],
  ctaButtons: {
    primary: { text: 'Book Your Spot', href: '/contact' },
    secondary: { text: 'View All Classes', href: '/classes' }
  },
  ctaFeatures: [
    { icon: '🏆', title: 'Competitions', description: 'Show off your skills in our friendly competitions' },
    { icon: '🎓', title: 'Workshops', description: 'Learn new techniques from industry professionals' },
    { icon: '🎊', title: 'Social Events', description: 'Connect with fellow dancers in our community events' }
  ]
}

export async function GET() {
  try {
    await ensureDbConnection()
    const rec = await prisma.eventsPageContent.findUnique({ where: { id: 'events' } })
    if (!rec) return NextResponse.json(DEFAULT_CONTENT)
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
  } catch (error) {
    console.error('[Events Content API Error]', error)
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

export const revalidate = 0