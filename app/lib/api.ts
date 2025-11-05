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
    // On server, we need absolute URLs for fetch in development
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
      const port = process.env.PORT || '3000'
      return `http://localhost:${port}/api/${clean}`
    }
    return `/api/${clean}`
  }
  // For external APIs, use the base URL
  const base = getApiBase()
  // On server in development, we need absolute URLs for fetch
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
    const fullBase = base || `http://localhost:${process.env.PORT || '3000'}`
    return `${fullBase}/api/${clean}`
  }
  // In production, use relative URLs so Vercel rewrites work, or absolute if base is provided
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    // In production on server, use relative URLs to leverage Vercel rewrites
    if (!base) {
      return `/api/${clean}`
    }
    // But if base is provided, use it
    return `${base}/api/${clean}`
  }
  // On client, use base URL or relative
  return base ? `${base}/api/${clean}` : `/api/${clean}`
}

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init)
}