import { NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

// Default new events page content
const DEFAULT_CONTENT = {
  heroTitle: 'All Dance Events',
  heroSubtitle: 'Explore our complete collection of upcoming dance events and find the perfect experience for you',
  eventsTitle: 'Browse All Events',
  eventsDescription: 'Discover workshops, competitions, performances, and social gatherings in our dance community',
  noEventsTitle: 'No Events Found',
  noEventsDescription: 'We couldn\'t find any events matching your criteria. Please try different search terms or filters.'
}

export async function GET() {
  try {
    await ensureDbConnection()
    // For now, we'll just return the default content
    // In a real implementation, you might want to fetch from a database
    return NextResponse.json(DEFAULT_CONTENT)
  } catch (error) {
    console.error('[New Events Content API Error]', error)
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

export const revalidate = 0