import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'

export async function GET() {
  try {
    await ensureDbConnection()
    const latest = await prisma.siteSettings.findFirst({ orderBy: { createdAt: 'desc' } })
    if (latest) {
      return NextResponse.json({
        siteName: latest.siteName,
        siteDescription: latest.siteDescription,
        contactEmail: latest.contactEmail,
        phoneNumber: latest.phoneNumber,
        address: latest.address,
        socialMedia: latest.socialMedia,
        footer: latest.footer,
        id: latest.id,
        createdAt: latest.createdAt,
        updatedAt: latest.updatedAt,
      })
    }
    return NextResponse.json({})
  } catch {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureDbConnection()
    const body = await req.json()
    const saved = await prisma.siteSettings.create({
      data: {
        siteName: body.siteName ?? 'DanceLink',
        siteDescription: body.siteDescription ?? '',
        contactEmail: body.contactEmail ?? '',
        phoneNumber: body.phoneNumber ?? null,
        address: body.address ?? null,
        socialMedia: body.socialMedia ?? null,
        footer: body.footer ?? null,
      }
    })
    return NextResponse.json({ success: true, updatedAt: saved.updatedAt })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
