export function getApiBase(): string {
  // On the client, always use relative URLs to avoid CORS; Next.js rewrites will proxy.
  if (typeof window !== 'undefined') return ''
  // On the server, prefer the explicit public env (works in Vercel too)
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (base && typeof base === 'string' && base.trim()) return base.replace(/\/$/, '')
  return ''
}

export function apiUrl(path: string): string {
  const base = getApiBase()
  const clean = path.replace(/^\/?/, '')
  return base ? `${base}/api/${clean}` : `/api/${clean}`
}

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init)
}
