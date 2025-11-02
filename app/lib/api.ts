export function getApiBase(): string {
  // Prefer explicit public env for both server and client
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (base && typeof base === 'string' && base.trim()) return base.replace(/\/$/, '')
  // Fallback to relative '/api' which will be proxied by Next.js rewrites
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
