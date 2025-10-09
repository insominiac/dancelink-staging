import { NextRequest } from 'next/server'

function parseCookie(header: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  header.split(';').forEach(part => {
    const [k, ...v] = part.trim().split('=')
    if (k) out[k] = decodeURIComponent(v.join('='))
  })
  return out
}

export function resolveLocale(req: NextRequest | undefined, fallback: string = 'en'): string {
  try {
    // 1) Explicit header from client
    const h = req?.headers
    const byHeader = h?.get('x-locale')?.trim()
    if (byHeader) return byHeader

    // 2) i18next cookie set by client
    const cookieHeader = h?.get('cookie')
    const cookies = parseCookie(cookieHeader)
    if (cookies['i18next']) return cookies['i18next']

    // 3) Accept-Language header
    const accept = h?.get('accept-language')
    if (accept) {
      const code = accept.split(',')[0]?.split('-')[0]
      if (code) return code
    }
  } catch {}
  return fallback
}
