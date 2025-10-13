import { cookies, headers } from 'next/headers'
import { translationService } from './translation-service'

// Server-side language detection
export function getServerLanguage(): string {
  try {
    // Check cookie first (most reliable)
    const cookieStore = cookies()
    const i18nCookie = cookieStore.get('i18next')
    if (i18nCookie?.value) {
      return i18nCookie.value.split('-')[0]
    }

    // Check Accept-Language header
    const headersList = headers()
    const acceptLanguage = headersList.get('accept-language')
    if (acceptLanguage) {
      // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
      const languages = acceptLanguage.split(',')
      if (languages[0]) {
        const lang = languages[0].split('-')[0].split(';')[0].trim()
        // Only support our known languages
        if (['en', 'es', 'ko', 'vi'].includes(lang)) {
          return lang
        }
      }
    }
  } catch (error) {
    console.error('Error detecting server language:', error)
  }

  return 'en' // Default to English
}

// Server-side translation function
export async function translateServer(
  text: string | null | undefined,
  targetLang?: string
): Promise<string> {
  if (!text) return ''
  
  const lang = targetLang || getServerLanguage()
  
  // If English or same as source, return original
  if (lang === 'en') return text
  
  try {
    return await translationService.translateText(text, lang, 'en')
  } catch (error) {
    console.error('Server translation error:', error)
    return text // Fallback to original text
  }
}

// Server-side batch translation
export async function translateServerBatch(
  texts: (string | null | undefined)[],
  targetLang?: string
): Promise<string[]> {
  const lang = targetLang || getServerLanguage()
  
  // Filter out empty texts but maintain indices
  const validTexts: string[] = []
  const indices: number[] = []
  const results: string[] = []
  
  texts.forEach((text, index) => {
    if (text) {
      validTexts.push(text)
      indices.push(index)
      results[index] = text // Default to original
    } else {
      results[index] = ''
    }
  })
  
  // If no valid texts or language is English, return original
  if (validTexts.length === 0 || lang === 'en') {
    return texts.map(t => t || '')
  }
  
  try {
    const translations = await translationService.translateBatch(validTexts, lang, 'en')
    
    // Map translations back to correct indices
    translations.forEach((translation, i) => {
      results[indices[i]] = translation
    })
    
    return results
  } catch (error) {
    console.error('Server batch translation error:', error)
    return texts.map(t => t || '') // Fallback to original texts
  }
}

// Server-side object translation
export async function translateServerObject<T extends Record<string, any>>(
  obj: T | null | undefined,
  fields: (keyof T)[],
  targetLang?: string
): Promise<T | null> {
  if (!obj) return null
  
  const lang = targetLang || getServerLanguage()
  
  // If English, return original
  if (lang === 'en') return obj
  
  // Extract texts to translate
  const textsToTranslate = fields.map(field => String(obj[field] || ''))
  
  try {
    const translations = await translateServerBatch(textsToTranslate, lang)
    
    // Create translated object
    const translatedObj = { ...obj }
    fields.forEach((field, index) => {
      if (translations[index]) {
        translatedObj[field] = translations[index] as any
      }
    })
    
    return translatedObj
  } catch (error) {
    console.error('Server object translation error:', error)
    return obj // Fallback to original object
  }
}

// Translate multiple objects
export async function translateServerObjects<T extends Record<string, any>>(
  objects: T[],
  fields: (keyof T)[],
  targetLang?: string
): Promise<T[]> {
  if (!objects || objects.length === 0) return objects
  
  const lang = targetLang || getServerLanguage()
  
  // If English, return original
  if (lang === 'en') return objects
  
  try {
    // Collect all texts to translate in one batch
    const allTexts: string[] = []
    objects.forEach(obj => {
      fields.forEach(field => {
        allTexts.push(String(obj[field] || ''))
      })
    })
    
    // Translate all at once
    const translations = await translateServerBatch(allTexts, lang)
    
    // Map translations back to objects
    let textIndex = 0
    return objects.map(obj => {
      const translatedObj = { ...obj }
      fields.forEach(field => {
        const translation = translations[textIndex++]
        if (translation) {
          translatedObj[field] = translation as any
        }
      })
      return translatedObj
    })
  } catch (error) {
    console.error('Server objects translation error:', error)
    return objects // Fallback to original objects
  }
}

// Cache wrapper for frequently accessed translations
const serverTranslationCache = new Map<string, { value: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes server cache

export async function translateServerWithCache(
  text: string,
  targetLang?: string
): Promise<string> {
  const lang = targetLang || getServerLanguage()
  const cacheKey = `${lang}:${text}`
  
  // Check cache
  const cached = serverTranslationCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value
  }
  
  // Translate and cache
  const translated = await translateServer(text, lang)
  serverTranslationCache.set(cacheKey, {
    value: translated,
    timestamp: Date.now()
  })
  
  // Clean old cache entries periodically
  if (serverTranslationCache.size > 1000) {
    const now = Date.now()
    for (const [key, value] of serverTranslationCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        serverTranslationCache.delete(key)
      }
    }
  }
  
  return translated
}