#!/usr/bin/env node

/**
 * Automated Translation Generator
 * Uses Google Translate API to generate accurate translations for all languages
 */

const fs = require('fs').promises
const path = require('path')

// You can also use other services like DeepL
const { Translate } = require('@google-cloud/translate').v2

class TranslationGenerator {
  constructor() {
    this.translate = null
    this.supportedLanguages = {
      en: 'English',
      es: 'Spanish', 
      ko: 'Korean',
      vi: 'Vietnamese',
      fr: 'French',
      de: 'German',
      pt: 'Portuguese',
      it: 'Italian',
      ja: 'Japanese',
      zh: 'Chinese (Simplified)',
      ar: 'Arabic',
      hi: 'Hindi'
    }
    this.initializeTranslator()
  }

  async initializeTranslator() {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
    
    if (!apiKey) {
      console.log('🚨 Google Translate API Key not found!')
      console.log('💡 To use Google Translate:')
      console.log('1. Go to Google Cloud Console')
      console.log('2. Enable the Google Translate API')
      console.log('3. Create an API key')
      console.log('4. Add to your .env file: GOOGLE_TRANSLATE_API_KEY=your_key_here')
      console.log('')
      console.log('🔄 For now, using LibreTranslate (free alternative)...')
      return
    }

    try {
      this.translate = new Translate({ key: apiKey })
      console.log('✅ Google Translate API initialized')
    } catch (error) {
      console.error('❌ Failed to initialize Google Translate:', error.message)
    }
  }

  // Free alternative using LibreTranslate
  async translateWithLibreTranslate(text, targetLang) {
    try {
      const response = await fetch('https://libretranslate.peppermint.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLang,
          format: 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.translatedText || text
    } catch (error) {
      console.error(`LibreTranslate error for ${targetLang}:`, error.message)
      return text
    }
  }

  async translateText(text, targetLang) {
    if (targetLang === 'en') return text

    try {
      if (this.translate) {
        // Use Google Translate
        const [translation] = await this.translate.translate(text, targetLang)
        return translation
      } else {
        // Use free LibreTranslate
        return await this.translateWithLibreTranslate(text, targetLang)
      }
    } catch (error) {
      console.error(`Translation error for "${text}" to ${targetLang}:`, error.message)
      return text
    }
  }

  async translateObject(obj, targetLang) {
    const result = {}
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        result[key] = await this.translateText(value, targetLang)
        // Add small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100))
      } else if (typeof value === 'object' && value !== null) {
        result[key] = await this.translateObject(value, targetLang)
      } else {
        result[key] = value
      }
    }
    
    return result
  }

  // English base translations (your source of truth)
  getEnglishTranslations() {
    return {
      nav: {
        siteName: 'DanceLink',
        home: 'Home',
        classes: 'Classes',
        events: 'Events',
        instructors: 'Instructors',
        forum: 'Forum',
        about: 'About',
        contact: 'Contact',
        loggedInAs: 'Logged in as'
      },
      hero: {
        subtitle: 'Connect Through Movement',
        title: 'Master the Art of Dance',
        description: 'Where dancers unite, stories unfold, and connections are made through the universal language of movement. Join our vibrant community today.',
        exploreClasses: 'Explore Classes',
        bookFreeTrial: 'Book Free Trial'
      },
      about: {
        title: 'Why Choose DanceLink?',
        description: 'Experience the difference of professional instruction and passionate community',
        expertInstructors: 'Expert Instructors',
        expertInstructorsDesc: 'Learn from certified professionals with years of experience in their craft',
        allLevelsWelcome: 'All Levels Welcome',
        allLevelsWelcomeDesc: 'From complete beginners to advanced dancers, we have the perfect class for you',
        modernFacilities: 'Modern Facilities',
        modernFacilitiesDesc: 'Dance in beautiful studios equipped with the latest sound systems and amenities'
      },
      homepage: {
        popularClasses: 'Popular Classes',
        discoverStyles: 'Discover Dance Styles',
        joinPopular: 'Join our most popular classes with real students',
        exploreDiverse: 'Explore our diverse range of dance styles',
        viewAll: 'View All Classes'
      },
      stats: {
        happyStudents: 'Happy Students',
        danceStyles: 'Dance Styles',
        expertInstructors: 'Expert Instructors',
        studioLocations: 'Studio Locations'
      },
      ui: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        submit: 'Submit',
        close: 'Close',
        open: 'Open',
        yes: 'Yes',
        no: 'No',
        confirm: 'Confirm',
        book: 'Book',
        bookNow: 'Book Now',
        learnMore: 'Learn More',
        viewDetails: 'View Details',
        getStarted: 'Get Started',
        tryFree: 'Try Free',
        signUp: 'Sign Up',
        logIn: 'Log In',
        logOut: 'Log Out'
      },
      footer: {
        allRightsReserved: 'All rights reserved.',
        quickLinks: 'Quick Links',
        followUs: 'Follow Us',
        getInTouch: 'Get in Touch',
        emailPlaceholder: 'Enter your email'
      }
    }
  }

  async generateAllTranslations() {
    console.log('🌍 Starting automated translation generation...')
    console.log('')

    const baseTranslations = this.getEnglishTranslations()
    const results = {}

    // Process each language
    for (const [langCode, langName] of Object.entries(this.supportedLanguages)) {
      console.log(`🔄 Generating ${langName} (${langCode}) translations...`)
      
      if (langCode === 'en') {
        results[langCode] = { common: baseTranslations }
        console.log(`✅ ${langName} (base language)`)
        continue
      }

      try {
        const translatedCommon = await this.translateObject(baseTranslations, langCode)
        results[langCode] = { common: translatedCommon }
        console.log(`✅ ${langName} completed`)
      } catch (error) {
        console.error(`❌ Failed to translate ${langName}:`, error.message)
        results[langCode] = { common: baseTranslations } // Fallback to English
      }
      
      // Add delay between languages to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return results
  }

  async saveTranslationsToFile(translations) {
    const outputPath = path.join(__dirname, '../lib/i18n-generated.ts')
    
    const content = `// Auto-generated translations - DO NOT EDIT MANUALLY
// Generated on: ${new Date().toISOString()}
// Use 'npm run generate-translations' to update

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = ${JSON.stringify(translations, null, 2)}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  })

export default i18n`

    await fs.writeFile(outputPath, content, 'utf8')
    console.log(`📁 Translations saved to: ${outputPath}`)
  }

  async updateLanguageSwitcher(supportedLanguages) {
    const switcherPath = path.join(__dirname, '../app/components/LanguageSwitcher.tsx')
    
    try {
      let content = await fs.readFile(switcherPath, 'utf8')
      
      const languageArray = Object.entries(supportedLanguages).map(([code, name]) => {
        const flags = {
          en: '🇺🇸', es: '🇪🇸', ko: '🇰🇷', vi: '🇻🇳',
          fr: '🇫🇷', de: '🇩🇪', pt: '🇵🇹', it: '🇮🇹',
          ja: '🇯🇵', zh: '🇨🇳', ar: '🇸🇦', hi: '🇮🇳'
        }
        
        return `{ code: '${code}', name: '${name}', nativeName: '${name}', flag: '${flags[code] || '🌍'}' }`
      }).join(',\\n  ')

      content = content.replace(
        /const languages = \[[\s\S]*?\]/,
        `const languages = [\n  ${languageArray}\n]`
      )

      await fs.writeFile(switcherPath, content, 'utf8')
      console.log('✅ Language switcher updated')
    } catch (error) {
      console.error('Failed to update language switcher:', error.message)
    }
  }

  async run() {
    try {
      // Generate translations
      const translations = await this.generateAllTranslations()
      
      // Save to file
      await this.saveTranslationsToFile(translations)
      
      // Update language switcher
      await this.updateLanguageSwitcher(this.supportedLanguages)
      
      console.log('')
      console.log('🎉 Translation generation completed!')
      console.log('')
      console.log('📋 Next steps:')
      console.log('1. Update your imports to use lib/i18n-generated.ts')
      console.log('2. Test all languages in your app')
      console.log('3. Make manual adjustments if needed')
      console.log('4. Re-run this script when adding new text')
      
    } catch (error) {
      console.error('💥 Translation generation failed:', error)
      process.exit(1)
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new TranslationGenerator()
  generator.run()
}

module.exports = TranslationGenerator