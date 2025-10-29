"use client"

import { useEffect, useMemo, useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const BATCH_DELAY_MS = 50 // Delay for batching translation requests

function readCache(key: string): string | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null

    // Backward compatibility: old entries were plain strings
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && typeof parsed.v === 'string') {
        const ts = typeof parsed.ts === 'number' ? parsed.ts : 0
        if (Date.now() - ts < CACHE_TTL_MS) {
          return parsed.v
        }
        return null
      }
      // If parse succeeded but not the expected shape, ignore
      return null
    } catch {
      // Not JSON, treat as legacy cache value without TTL
      return raw
    }
  } catch {
    return null
  }
}

function writeCache(key: string, value: string) {
  try {
    const payload = JSON.stringify({ v: value, ts: Date.now() })
    localStorage.setItem(key, payload)
  } catch {}
}

export function useAutoTranslate(text: string | null | undefined) {
  const { i18n } = useTranslation()
  const langRaw = i18n.language || 'en'
  const lang = (langRaw || 'en').split('-')[0]
  const source = 'en'
  const [translated, setTranslated] = useState<string>(text || '')

  const cacheKey = useMemo(() => {
    const base = (text || '').trim()
    return `${source}::${lang}::${base}`
  }, [text, lang])

  useEffect(() => {
    const base = (text || '').trim()
    if (!base) {
      setTranslated('')
      return
    }
    if (lang === source) {
      setTranslated(base)
      return
    }

    const cached = readCache(cacheKey)
    if (cached) {
      // If cached equals the source text and target is not English, treat as stale and fetch again
      if (lang !== source && cached === base) {
        // continue to fetch below
      } else {
        setTranslated(cached)
        return
      }
    }

    let aborted = false
    ;(async () => {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: [base], target: lang, source })
        })
        if (!res.ok) {
          if (!aborted) setTranslated(base)
          return
        }
        const data = await res.json()
        const out = Array.isArray(data.translations) ? data.translations[0] : base
        if (!aborted) {
          setTranslated(out)
          // Avoid caching untranslated results for non-English targets to prevent sticky English
          if (!(lang !== source && out === base)) {
            writeCache(cacheKey, out)
          }
        }
      } catch {
        if (!aborted) setTranslated(base)
      }
    })()

    return () => { aborted = true }
  }, [text, lang, cacheKey])

  return translated
}

export default function TranslatedText({ text }: { text: string | null | undefined }) {
  const out = useAutoTranslate(text)
  return <>{out}</>
}
