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

// Basic locale sanitizer to avoid invalid values like "*"
export function sanitizeLocale(input: string | null | undefined, fallback: string = 'en'): string {
  const raw = (input || '').trim().toLowerCase()
  if (!raw) return fallback
  // Reject wildcards and obviously invalid values
  if (raw === '*' || raw === 'und' || raw === 'null' || raw === 'undefined') return fallback
  // Allow patterns like "en", "es", "pt-br"
  const m = raw.match(/^[a-z]{2}(-[a-z]{2})?$/i)
  if (!m) return fallback
  return raw
}

export function resolveLocale(req: NextRequest | undefined, fallback: string = 'en'): string {
  try {
    // 1) Explicit header from client
    const h = req?.headers
    const byHeader = h?.get('x-locale')?.trim()
    if (byHeader) return sanitizeLocale(byHeader, fallback)

    // 2) i18next cookie set by client
    const cookieHeader = h?.get('cookie')
    const cookies = parseCookie(cookieHeader)
    if (cookies['i18next']) return sanitizeLocale(cookies['i18next'], fallback)

    // 3) Accept-Language header
    const accept = h?.get('accept-language')
    if (accept) {
      const primary = accept.split(',')[0]?.split(';')[0]
      if (primary) return sanitizeLocale(primary, fallback)
    }
  } catch {}
  return fallback
}
