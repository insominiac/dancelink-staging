import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Content file path - in a real app, this would be stored in a database
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'site-settings.json')

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
    twitter: "https://twitter.com/dancelink",
    youtube: "https://youtube.com/@dancelink",
    tiktok: "https://tiktok.com/@dancelink",
    linkedin: "https://linkedin.com/company/dancelink"
  },
  footer: {
    enabled: true,
    layout: "centered",
    backgroundColor: "gray-900",
    textColor: "white",
    copyrightText: "All rights reserved.",
    copyrightYear: "2024",
    customCopyrightText: "",
    tagline: "Connecting dancers worldwide through movement and passion",
    showTagline: true,
    showSocialLinks: true,
    showQuickLinks: true,
    showContact: true,
    socialLinksTitle: "Follow Us",
    quickLinks: [
      {
        title: "Classes",
        url: "/classes",
        openInNewTab: false
      },
      {
        title: "Events",
        url: "/events",
        openInNewTab: false
      },
      {
        title: "Instructors",
        url: "/instructors",
        openInNewTab: false
      },
      {
        title: "About Us",
        url: "/about",
        openInNewTab: false
      },
      {
        title: "Contact",
        url: "/contact",
        openInNewTab: false
      }
    ],
    contactSection: {
      title: "Get in Touch",
      showEmail: true,
      showPhone: true,
      showAddress: true
    },
    additionalSections: [
      {
        title: "Dance Styles",
        links: [
          {
            title: "Ballet",
            url: "/classes?style=ballet",
            openInNewTab: false
          },
          {
            title: "Hip Hop",
            url: "/classes?style=hiphop",
            openInNewTab: false
          },
          {
            title: "Contemporary",
            url: "/classes?style=contemporary",
            openInNewTab: false
          },
          {
            title: "Salsa",
            url: "/classes?style=salsa",
            openInNewTab: false
          }
        ]
      }
    ],
    customHTML: "",
    newsletter: {
      enabled: true,
      title: "Stay Updated",
      description: "Get the latest updates on classes, events, and dance tips!",
      buttonText: "Subscribe"
    }
  }
}

export async function GET() {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(SETTINGS_FILE)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Try to read existing settings
    try {
      const settings = await fs.readFile(SETTINGS_FILE, 'utf-8')
      return NextResponse.json(JSON.parse(settings))
    } catch {
      // If file doesn't exist, return default settings
      return NextResponse.json(DEFAULT_SETTINGS)
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json()
    
    // Validate required fields
    if (!settings.siteName || !settings.contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(settings.contactEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate footer structure if present
    if (settings.footer) {
      // Validate quick links if present
      if (settings.footer.quickLinks && Array.isArray(settings.footer.quickLinks)) {
        for (const link of settings.footer.quickLinks) {
          if (!link.title || !link.url) {
            return NextResponse.json({ error: 'Invalid quick link: title and url are required' }, { status: 400 })
          }
          // Basic URL validation
          try {
            new URL(link.url.startsWith('/') ? `https://example.com${link.url}` : link.url)
          } catch {
            return NextResponse.json({ error: `Invalid URL in quick links: ${link.url}` }, { status: 400 })
          }
        }
      }

      // Validate additional sections if present
      if (settings.footer.additionalSections && Array.isArray(settings.footer.additionalSections)) {
        for (const section of settings.footer.additionalSections) {
          if (!section.title) {
            return NextResponse.json({ error: 'Additional section must have a title' }, { status: 400 })
          }
          if (section.links && Array.isArray(section.links)) {
            for (const link of section.links) {
              if (!link.title || !link.url) {
                return NextResponse.json({ error: `Invalid link in section '${section.title}': title and url are required` }, { status: 400 })
              }
              try {
                new URL(link.url.startsWith('/') ? `https://example.com${link.url}` : link.url)
              } catch {
                return NextResponse.json({ error: `Invalid URL in section '${section.title}': ${link.url}` }, { status: 400 })
              }
            }
          }
        }
      }
    }

    // Ensure data directory exists
    const dataDir = path.dirname(SETTINGS_FILE)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Save settings to file
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2))

    return NextResponse.json({ 
      success: true, 
      message: 'Site settings updated successfully',
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error saving site settings:', error)
    return NextResponse.json({ error: 'Failed to save site settings' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Reset to default settings
    const dataDir = path.dirname(SETTINGS_FILE)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2))

    return NextResponse.json({ 
      success: true, 
      message: 'Site settings reset to defaults',
      settings: DEFAULT_SETTINGS
    })
  } catch (error) {
    console.error('Error resetting site settings:', error)
    return NextResponse.json({ error: 'Failed to reset site settings' }, { status: 500 })
  }
}