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
      const port = process.env.PORT || '3000'
      return `http://localhost:${port}/api/${clean}`
    }
    return `/api/${clean}`
  }
  const base = getApiBase()
  // On server, we need absolute URLs for fetch
  if (typeof window === 'undefined') {
    const fullBase = base || `http://localhost:${process.env.PORT || '3000'}`
    return `${fullBase}/api/${clean}`
  }
  return base ? `${base}/api/${clean}` : `/api/${clean}`
}

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init)
}
