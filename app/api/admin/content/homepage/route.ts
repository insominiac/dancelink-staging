import { NextRequest, NextResponse } from 'next/server'

// Default homepage content
const DEFAULT_CONTENT = {
  heroTitle: "Master the Art of Dance",
  heroSubtitle: "Connect with passionate dancers and experienced instructors through DanceLink",
  heroButtonText: "Start Your Journey",
  heroBackgroundImage: null,
  aboutTitle: "Why Choose DanceLink?",
  aboutDescription: "We connect dancers worldwide through our comprehensive platform, offering classes for all skill levels with expert instructors and a supportive community.",
  testimonialsEnabled: true,
  newsletterEnabled: true
}

export async function GET() {
  try {
    // Return default content for Vercel compatibility
    return NextResponse.json(DEFAULT_CONTENT)
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const content = await request.json()
    
    // Validate required fields
    if (!content.heroTitle || !content.heroSubtitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For Vercel compatibility, just return success without persisting
    console.log('Homepage content update requested (not persisted):', content)

    return NextResponse.json({ 
      success: true, 
      message: 'Homepage content received (not persisted on Vercel)',
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating homepage content:', error)
    return NextResponse.json({ error: 'Failed to update homepage content' }, { status: 500 })
  }
}

// Allow POST by delegating to PUT (for clients using POST)
export async function POST(request: NextRequest) {
  return PUT(request)
}

// Optional: handle CORS preflight if calling cross-origin
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
