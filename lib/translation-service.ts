import { Translate } from '@google-cloud/translate/build/src/v2'

interface TranslationCache {
  [key: string]: {
    [lang: string]: string
  }
}

class TranslationService {
  private translate: any
  private cache: TranslationCache = {}
  private isGoogleTranslateEnabled: boolean

  constructor() {
    this.isGoogleTranslateEnabled = !!process.env.GOOGLE_TRANSLATE_API_KEY
    
    if (this.isGoogleTranslateEnabled) {
      this.translate = new Translate({
        key: process.env.GOOGLE_TRANSLATE_API_KEY,
      })
    }
  }

  /**
   * Translate text using Google Translate API
   */
  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'en'): Promise<string> {
    // Return original text if same language
    if (targetLanguage === sourceLanguage) {
      return text
    }

    // Check cache first
    const cacheKey = `${sourceLanguage}-${text}`
    if (this.cache[cacheKey] && this.cache[cacheKey][targetLanguage]) {
      return this.cache[cacheKey][targetLanguage]
    }

    if (!this.isGoogleTranslateEnabled) {
      console.warn('Google Translate API not configured, returning original text')
      return text
    }

    try {
      const [translation] = await this.translate.translate(text, {
        from: sourceLanguage,
        to: targetLanguage,
      })

      // Cache the result
      if (!this.cache[cacheKey]) {
        this.cache[cacheKey] = {}
      }
      this.cache[cacheKey][targetLanguage] = translation

      return translation
    } catch (error) {
      console.error('Translation error:', error)
      return text // Return original text on error
    }
  }

  /**
   * Translate multiple texts at once (more efficient)
   */
  async translateBatch(texts: string[], targetLanguage: string, sourceLanguage: string = 'en'): Promise<string[]> {
    if (targetLanguage === sourceLanguage) {
      return texts
    }

    if (!this.isGoogleTranslateEnabled) {
      return texts
    }

    try {
      const [translationsRaw] = await this.translate.translate(texts, {
        from: sourceLanguage,
        to: targetLanguage,
      })

      const translationsArr = Array.isArray(translationsRaw) ? translationsRaw : [translationsRaw]

      // Cache results
      texts.forEach((text, index) => {
        const cacheKey = `${sourceLanguage}-${text}`
        if (!this.cache[cacheKey]) {
          this.cache[cacheKey] = {}
        }
        this.cache[cacheKey][targetLanguage] = translationsArr[index]
      })

      return translationsArr
    } catch (error) {
      console.error('Batch translation error:', error)
      return texts
    }
  }

  /**
   * Get all translations for a set of keys
   */
  async generateTranslationsForLanguage(
    englishTranslations: Record<string, any>,
    targetLanguage: string
  ): Promise<Record<string, any>> {
    const result: Record<string, any> = {}

    for (const [key, value] of Object.entries(englishTranslations)) {
      if (typeof value === 'string') {
        result[key] = await this.translateText(value, targetLanguage)
      } else if (typeof value === 'object' && value !== null) {
        result[key] = await this.generateTranslationsForLanguage(value, targetLanguage)
      } else {
        result[key] = value
      }
    }

    return result
  }

  /**
   * Get cached translation or translate on demand
   */
  async getTranslation(key: string, targetLanguage: string, fallback: string = key): Promise<string> {
    if (targetLanguage === 'en') {
      return fallback
    }

    const cacheKey = `en-${fallback}`
    if (this.cache[cacheKey] && this.cache[cacheKey][targetLanguage]) {
      return this.cache[cacheKey][targetLanguage]
    }

    return await this.translateText(fallback, targetLanguage)
  }
}

// Export singleton instance
export const translationService = new TranslationService()
export default TranslationService