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
    return `/api/${clean}`
  }
  // On the client, use the base URL or relative paths
  if (typeof window !== 'undefined') {
    const base = getApiBase()
    return base ? `${base}/api/${clean}` : `/api/${clean}`
  }
  // On the server, use relative URLs so Vercel rewrites can work
  return `/api/${clean}`
}

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init)
}