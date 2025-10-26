import { NextRequest, NextResponse } from 'next/server'

// Default settings content
const DEFAULT_CONTENT = {
  siteName: "DanceLink",
  siteDescription: "Professional dance platform connecting dancers, instructors, and studios worldwide",
  contactEmail: "info@dancelink.com",
  phone: "+1 (555) 123-4567",
  address: "123 Dance Street, City, State 12345",
  socialMedia: {
    facebook: "https://facebook.com/dancelink",
    instagram: "https://instagram.com/dancelink",
    twitter: "https://twitter.com/dancelink"
  },
  footer: {
    enabled: true,
    copyrightText: "© 2025 DanceLink. All rights reserved."
  }
}

export async function GET() {
  try {
    return NextResponse.json(DEFAULT_CONTENT)
  } catch (error) {
    console.error('Error fetching settings content:', error)
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const content = await request.json()
    
    console.log('Settings content update requested (not persisted):', content)

    return NextResponse.json({ 
      success: true, 
      message: 'Settings content received (not persisted on Vercel)',
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating settings content:', error)
    return NextResponse.json({ error: 'Failed to update settings content' }, { status: 500 })
  }
}