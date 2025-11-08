export function getApiBase(): string {
  // On the client, always use relative URLs to avoid CORS; Next.js rewrites will proxy.
  if (typeof window !== 'undefined') return ''
  // On the server, prefer the explicit public env (works in Vercel too)
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (base && typeof base === 'string' && base.trim()) return base.replace(/\/$/, '')
  return ''
}

export function apiUrl(path: string): string {
  const clean = path.replace(/^\/?/, '')
  // Always use local routes for content APIs
  if (clean.startsWith('public/content/') || clean.startsWith('admin/content/')) {
    // On server, we need absolute URLs for fetch
    if (typeof window === 'undefined') {
      // In development, use localhost
      if (process.env.NODE_ENV === 'development') {
        const port = process.env.PORT || '3000'
        return `http://localhost:${port}/api/${clean}`
      }
      // In production, we still need absolute URLs for fetch to work
      // Use the Vercel URL or default to localhost if not available
      const vercelUrl = process.env.VERCEL_URL
      if (vercelUrl) {
        return `https://${vercelUrl}/api/${clean}`
      }
      // Fallback to localhost (shouldn't happen in production)
      const port = process.env.PORT || '3000'
      return `http://localhost:${port}/api/${clean}`
    }
    // On client, use relative URLs
    return `/api/${clean}`
  }
  
  // For public events API, use local routes instead of external proxy
  if (clean.startsWith('public/events')) {
    // On server, we need absolute URLs for fetch
    if (typeof window === 'undefined') {
      // In development, construct full URL
      if (process.env.NODE_ENV === 'development') {
        const port = process.env.PORT || '3000'
        return `http://localhost:${port}/api/${clean}`
      }
      // In production (Vercel), use the Vercel URL directly
      const vercelUrl = process.env.VERCEL_URL
      if (vercelUrl) {
        return `https://${vercelUrl}/api/${clean}`
      }
      // Fallback
      const port = process.env.PORT || '3000'
      return `http://localhost:${port}/api/${clean}`
    }
    // On client, use relative URLs
    return `/api/${clean}`
  }
  
  // For external APIs, use the base URL or proxy through rewrites
  const base = getApiBase()
  // On server, we need absolute URLs for fetch
  if (typeof window === 'undefined') {
    // In development, construct full URL
    if (process.env.NODE_ENV === 'development') {
      const fullBase = base || `http://localhost:${process.env.PORT || '3000'}`
      return `${fullBase}/api/${clean}`
    }
    // In production, if we have a base URL, use it; otherwise use relative for rewrites
    if (base) {
      return `${base}/api/${clean}`
    }
    // For rewrites to work, we need to use the external service URL directly in server-side fetch
    // But we still need an absolute URL for fetch to work
    const vercelUrl = process.env.VERCEL_URL
    if (vercelUrl) {
      return `https://${vercelUrl}/api/${clean}`
    }
    // Fallback
    const port = process.env.PORT || '3000'
    return `http://localhost:${port}/api/${clean}`
  }
  // On client, use base URL or relative
  return base ? `${base}/api/${clean}` : `/api/${clean}`
}

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init)
}