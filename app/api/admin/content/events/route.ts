import { NextRequest, NextResponse } from 'next/server'

// Default events content
const DEFAULT_CONTENT = {
  heroTitle: "Dance Events & Workshops",
  heroSubtitle: "Discover exciting dance events, workshops, and performances",
  heroButtonText: "View All Events",
  featuredEventsEnabled: true,
  upcomingEventsEnabled: true,
  eventCategoriesEnabled: true
}

export async function GET() {
  try {
    return NextResponse.json(DEFAULT_CONTENT)
  } catch (error) {
    console.error('Error fetching events content:', error)
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const content = await request.json()
    
    console.log('Events content update requested (not persisted):', content)

    return NextResponse.json({ 
      success: true, 
      message: 'Events content received (not persisted on Vercel)',
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating events content:', error)
    return NextResponse.json({ error: 'Failed to update events content' }, { status: 500 })
  }
}