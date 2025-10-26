import type { MetadataRoute } from 'next'
import prisma from '@/app/lib/db'

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || ''
  return url ? url.replace(/\/$/, '') : 'http://localhost:3000'
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl()

  // Fetch dynamic paths
  const [seoPages, classes, events] = await Promise.all([
    prisma.seoPage.findMany({
      where: { isActive: true },
      select: { path: true, lastModified: true, priority: true, canonical: true },
      orderBy: { priority: 'desc' }
    }),
    prisma.class.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true }
    }),
    prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, updatedAt: true }
    })
  ])

  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = seoPages.map((p) => ({
    url: `${base}${p.canonical || p.path}`,
    lastModified: p.lastModified || now,
    changeFrequency: 'weekly',
    priority: Math.max(0.1, Math.min(1, (p.priority || 5) / 10))
  }))

  const classEntries: MetadataRoute.Sitemap = classes.map((c) => ({
    url: `${base}/classes/${c.id}`,
    lastModified: c.updatedAt || now,
    changeFrequency: 'weekly',
    priority: 0.6
  }))

  const eventEntries: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${base}/events/${e.id}`,
    lastModified: e.updatedAt || now,
    changeFrequency: 'daily',
    priority: 0.7
  }))

  // Always include root
  const root: MetadataRoute.Sitemap = [{
    url: `${base}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8
  }]

  return [...root, ...staticEntries, ...classEntries, ...eventEntries]
}
