import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Content file path - same as admin version but public access
const EVENTS_CONTENT_FILE = path.join(process.cwd(), 'data', 'events-content.json')

// Default events page content (same as admin version)
const DEFAULT_EVENTS_CONTENT = {
  // Hero Section
  heroBadgeText: "Experience the Magic of Dance",
  heroTitle: "Upcoming Events",
  heroSubtitle: "Join our exclusive dance events, workshops, and competitions. Where passion meets performance in an unforgettable experience.",
  heroFeatures: [
    { icon: "🎪", text: "Exclusive events" },
    { icon: "🏆", text: "World-class performances" },
    { icon: "✨", text: "Unforgettable experiences" }
  ],

  // Featured Section
  featuredTitle: "Featured Events",
  featuredDescription: "Don't miss these exclusive, hand-picked events featuring our most popular performances and workshops",

  // Search Section
  searchTitle: "Find Your Perfect Event",
  searchDescription: "Search and filter events by type, date, and budget",

  // CTA Section
  ctaBadgeText: "Join the Experience",
  ctaTitle: "Ready to Dance?",
  ctaDescription: "Don't miss out on these exclusive dance events! Book early to secure your spot and join our vibrant community of dancers.",
  ctaButtons: {
    primary: { text: "🎫 Reserve Your Spot", href: "/contact" },
    secondary: { text: "📞 Get Event Updates", href: "/contact" }
  },
  ctaFeatures: [
    {
      icon: "🎯",
      title: "Early Bird Discounts",
      description: "Book in advance and save up to 25% on event tickets"
    },
    {
      icon: "🎆",
      title: "VIP Experience",
      description: "Front row seats and exclusive meet & greets available"
    },
    {
      icon: "🎁",
      title: "Group Packages",
      description: "Bring friends and save more with special group rates"
    }
  ]
}

export async function GET() {
  try {
    // Try to read existing content from admin-managed file
    try {
      const content = await fs.readFile(EVENTS_CONTENT_FILE, 'utf-8')
      return NextResponse.json(JSON.parse(content))
    } catch {
      // If file doesn't exist, return default content
      return NextResponse.json(DEFAULT_EVENTS_CONTENT)
    }
  } catch (error) {
    console.error('Error fetching events content:', error)
    // Even if there's an error, return default content to prevent blocking the page
    return NextResponse.json(DEFAULT_EVENTS_CONTENT)
  }
}