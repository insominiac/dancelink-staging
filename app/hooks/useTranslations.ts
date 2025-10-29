"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const BATCH_DELAY_MS = 50 // Delay for batching translation requests

// Translation cache interface
interface TranslationCache {
  [key: string]: {
    value: string
    timestamp: number
  }
}

// Batch queue for translations
interface BatchItem {
  text: string
  resolve: (value: string) => void
  reject: (error: any) => void
}

// Global batch queue
let batchQueue: BatchItem[] = []
let batchTimer: NodeJS.Timeout | null = null

// Read from localStorage cache
function readCache(key: string): string | null {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null
    
    const parsed = JSON.parse(cached)
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed.value
    }
    localStorage.removeItem(key) // Remove expired cache
    return null
  } catch {
    return null
  }
}

// Write to localStorage cache
function writeCache(key: string, value: string) {
  try {
    localStorage.setItem(key, JSON.stringify({
      value,
      timestamp: Date.now()
    }))
  } catch {
    // Ignore cache write errors
  }
}

// Process batch translations
async function processBatch(targetLang: string, sourceLang: string = 'en') {
  if (batchQueue.length === 0) return
  
  const currentBatch = [...batchQueue]
  batchQueue = []
  
  const texts = currentBatch.map(item => item.text)
  
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, target: targetLang, source: sourceLang })
    })
    
    if (!response.ok) throw new Error('Translation failed')
    
    const data = await response.json()
    const translations = data.translations || texts
    
    currentBatch.forEach((item, index) => {
      const translated = translations[index] || item.text
      const cacheKey = `${sourceLang}::${targetLang}::${item.text}`
      
      // Don't cache if translation is same as source (likely untranslated)
      if (targetLang !== sourceLang && translated !== item.text) {
        writeCache(cacheKey, translated)
      }
      
      item.resolve(translated)
    })
  } catch (error) {
    // On error, resolve with original text
    currentBatch.forEach(item => item.resolve(item.text))
  }
}

// Queue a translation for batch processing
function queueTranslation(text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> {
  return new Promise((resolve, reject) => {
    batchQueue.push({ text, resolve, reject })
    
    // Clear existing timer
    if (batchTimer) clearTimeout(batchTimer)
    
    // Set new timer for batch processing
    batchTimer = setTimeout(() => {
      processBatch(targetLang, sourceLang)
    }, BATCH_DELAY_MS)
  })
}

// Hook for translating a single text
export function useAutoTranslate(text: string | null | undefined): string {
  const { i18n } = useTranslation()
  const lang = (i18n.language || 'en').split('-')[0]
  const [translated, setTranslated] = useState<string>(text || '')
  const abortRef = useRef(false)
  
  useEffect(() => {
    abortRef.current = false
    
    const baseText = (text || '').trim()
    if (!baseText) {
      setTranslated('')
      return
    }
    
    // If same language, return original
    if (lang === 'en') {
      setTranslated(baseText)
      return
    }
    
    // Check cache first
    const cacheKey = `en::${lang}::${baseText}`
    const cached = readCache(cacheKey)
    
    if (cached) {
      setTranslated(cached)
      return
    }
    
    // Queue for translation
    queueTranslation(baseText, lang, 'en').then(result => {
      if (!abortRef.current) {
        setTranslated(result)
      }
    })
    
    return () => {
      abortRef.current = true
    }
  }, [text, lang])
  
  return translated
}

// Hook for translating multiple texts
export function useAutoTranslateMultiple(texts: (string | null | undefined)[]): string[] {
  const { i18n } = useTranslation()
  const lang = (i18n.language || 'en').split('-')[0]
  const [translations, setTranslations] = useState<string[]>(texts.map(t => t || ''))
  const abortRef = useRef(false)
  
  useEffect(() => {
    abortRef.current = false
    
    // Filter and clean texts
    const cleanTexts = texts.map(t => (t || '').trim())
    
    // If same language or no texts, return original
    if (lang === 'en' || cleanTexts.every(t => !t)) {
      setTranslations(cleanTexts)
      return
    }
    
    // Check cache and identify texts needing translation
    const results: (string | null)[] = []
    const toTranslate: { index: number; text: string }[] = []
    
    cleanTexts.forEach((text, index) => {
      if (!text) {
        results[index] = ''
        return
      }
      
      const cacheKey = `en::${lang}::${text}`
      const cached = readCache(cacheKey)
      
      if (cached) {
        results[index] = cached
      } else {
        results[index] = null
        toTranslate.push({ index, text })
      }
    })
    
    // If all cached, return immediately
    if (toTranslate.length === 0) {
      setTranslations(results as string[])
      return
    }
    
    // Translate missing texts
    Promise.all(
      toTranslate.map(item => queueTranslation(item.text, lang, 'en'))
    ).then(translatedTexts => {
      if (!abortRef.current) {
        toTranslate.forEach((item, i) => {
          results[item.index] = translatedTexts[i]
        })
        setTranslations(results as string[])
      }
    })
    
    return () => {
      abortRef.current = true
    }
  }, [texts, lang])
  
  return translations
}

// Hook for translating an object's string properties
export function useAutoTranslateObject<T extends Record<string, any>>(
  obj: T | null | undefined,
  fields: (keyof T)[]
): T | null {
  const { i18n } = useTranslation()
  const lang = (i18n.language || 'en').split('-')[0]
  const [translatedObj, setTranslatedObj] = useState<T | null>(obj || null)
  const abortRef = useRef(false)
  
  useEffect(() => {
    abortRef.current = false
    
    if (!obj) {
      setTranslatedObj(null)
      return
    }
    
    // If same language, return original
    if (lang === 'en') {
      setTranslatedObj(obj)
      return
    }
    
    // Extract texts to translate
    const textsToTranslate = fields
      .map(field => ({ field, text: String(obj[field] || '') }))
      .filter(item => item.text)
    
    if (textsToTranslate.length === 0) {
      setTranslatedObj(obj)
      return
    }
    
    // Translate all fields
    Promise.all(
      textsToTranslate.map(item => 
        queueTranslation(item.text, lang, 'en').then(translated => ({
          field: item.field,
          translated
        }))
      )
    ).then(results => {
      if (!abortRef.current) {
        const translated = { ...obj }
        results.forEach(result => {
          translated[result.field] = result.translated as any
        })
        setTranslatedObj(translated)
      }
    })
    
    return () => {
      abortRef.current = true
    }
  }, [obj, fields, lang])
  
  return translatedObj
}

// Component wrapper for auto-translation
interface TranslatedTextProps {
  text: string | null | undefined
  fallback?: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function TranslatedText({ 
  text, 
  fallback = '', 
  className,
  as: Component = 'span' 
}: TranslatedTextProps) {
  const translated = useAutoTranslate(text || fallback)
  
  return <Component className={className}>{translated}</Component>
}

// Export for backward compatibility
export default TranslatedText