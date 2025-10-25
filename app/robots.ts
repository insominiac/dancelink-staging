import type { MetadataRoute } from 'next'

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || ''
  return url ? url.replace(/\/$/, '') : 'http://localhost:3000'
}

export default function robots(): MetadataRoute.Robots {
  const base = baseUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/classes', '/events', '/about', '/contact', '/instructors'],
        disallow: ['/admin', '/dashboard', '/api']
      }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  }
}
