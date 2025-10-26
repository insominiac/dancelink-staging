import { NextRequest, NextResponse } from 'next/server'

// Default instructors content
const DEFAULT_CONTENT = {
  heroTitle: "Meet Our Expert Instructors",
  heroSubtitle: "Learn from passionate professionals with years of experience",
  heroButtonText: "View All Instructors",
  featuredInstructorsEnabled: true,
  instructorProfilesEnabled: true,
  specialtiesEnabled: true
}

export async function GET() {
  try {
    return NextResponse.json(DEFAULT_CONTENT)
  } catch (error) {
    console.error('Error fetching instructors content:', error)
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const content = await request.json()
    
    console.log('Instructors content update requested (not persisted):', content)

    return NextResponse.json({ 
      success: true, 
      message: 'Instructors content received (not persisted on Vercel)',
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating instructors content:', error)
    return NextResponse.json({ error: 'Failed to update instructors content' }, { status: 500 })
  }
}