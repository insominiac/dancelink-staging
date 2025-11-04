import { NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

const DEFAULT_SETTINGS = {
  siteName: 'DanceLink',
  siteDescription: 'Connect, Learn, Dance - Premier dance platform offering classes for all levels',
  contactEmail: 'info@dancelink.com',
  phoneNumber: '+1 (555) 123-4567',
  address: '123 Dance Street, City, State 12345',
  socialMedia: {
    facebook: 'https://facebook.com/dancelink',
    instagram: 'https://instagram.com/dancelink',
    twitter: 'https://twitter.com/dancelink',
  },
  footer: {
    enabled: true,
    layout: 'columns',
    backgroundColor: 'gray-900',
    showTagline: true,
    tagline: 'Connecting dancers worldwide through movement and passion',
    copyrightYear: new Date().getFullYear().toString(),
    copyrightText: 'All rights reserved.',
    showSocialLinks: true,
    socialLinksTitle: 'Follow Us',
    showQuickLinks: true,
    quickLinks: [
      { title: 'About', url: '/about', openInNewTab: false },
      { title: 'Classes', url: '/classes', openInNewTab: false },
      { title: 'Events', url: '/events', openInNewTab: false },
      { title: 'Contact', url: '/contact', openInNewTab: false },
    ],
    showContact: true,
    contactSection: {
      title: 'Get in Touch',
      showEmail: true,
      showPhone: true,
      showAddress: true,
    },
    newsletter: {
      enabled: true,
      title: 'Stay Updated',
      description: 'Get the latest updates on classes, events, and dance tips!',
      buttonText: 'Subscribe',
    },
  },
}

export async function GET() {
  try {
    await ensureDbConnection()
    const settings = await prisma.siteSettings.findFirst({ orderBy: { createdAt: 'desc' } })
    if (settings) {
      return NextResponse.json({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        phoneNumber: settings.phoneNumber,
        address: settings.address || DEFAULT_SETTINGS.address,
        socialMedia: (settings.socialMedia as any) || DEFAULT_SETTINGS.socialMedia,
        footer: (settings.footer as any) || DEFAULT_SETTINGS.footer,
      })
    }
    return NextResponse.json(DEFAULT_SETTINGS)
  } catch (e) {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export const revalidate = 0
