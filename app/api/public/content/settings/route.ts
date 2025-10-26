import { NextResponse } from 'next/server'
import db, { ensureDbConnection } from '@/app/lib/db'

// Default site settings
const DEFAULT_SETTINGS = {
  siteName: "DanceLink",
  siteDescription: "Connect, Learn, Dance - Premier dance platform offering classes for all levels",
  contactEmail: "info@dancelink.com",
  phoneNumber: "+1 (555) 123-4567",
  address: "123 Dance Street, City, State 12345",
  socialMedia: {
    facebook: "https://facebook.com/dancelink",
    instagram: "https://instagram.com/dancelink",
    twitter: "https://twitter.com/dancelink"
  },
  footer: {
    copyrightText: "All rights reserved.",
    tagline: "Connecting dancers worldwide through movement and passion",
    showSocialLinks: true,
    showTagline: true
  }
}

export async function GET() {
  try {
    await ensureDbConnection()
    // Try to get settings from database
    const settings = await db.siteSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    if (settings) {
      return NextResponse.json({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        phoneNumber: settings.phoneNumber,
        address: settings.address,
        socialMedia: settings.socialMedia || DEFAULT_SETTINGS.socialMedia,
        footer: settings.footer || DEFAULT_SETTINGS.footer
      })
    } else {
      // If no settings exist, return default settings
      return NextResponse.json(DEFAULT_SETTINGS)
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
    // Return default settings if there's any error
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

// Add caching headers for better performance
export const revalidate = 300 // Revalidate every 5 minutes