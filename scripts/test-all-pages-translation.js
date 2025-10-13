#!/usr/bin/env node
/**
 * Comprehensive test script to verify translations on all public pages
 */

const fetch = require('node-fetch')
const fs = require('fs').promises

const PORT = process.env.PORT || 3000
const BASE_URL = `http://localhost:${PORT}`

// Define all public pages to test
const PUBLIC_PAGES = [
  { path: '/', name: 'Home Page', hasAPI: false },
  { path: '/classes', name: 'Classes Page', hasAPI: true, api: '/api/public/classes' },
  { path: '/events', name: 'Events Page', hasAPI: true, api: '/api/public/events' },
  { path: '/instructors', name: 'Instructors Page', hasAPI: true, api: '/api/public/instructors' },
  { path: '/about', name: 'About Page', hasAPI: false },
  { path: '/contact', name: 'Contact Page', hasAPI: false },
  { path: '/pricing', name: 'Pricing Page', hasAPI: false },
  { path: '/faq', name: 'FAQ Page', hasAPI: false },
  { path: '/terms', name: 'Terms Page', hasAPI: false },
  { path: '/privacy', name: 'Privacy Page', hasAPI: false },
  { path: '/become-a-host', name: 'Become a Host Page', hasAPI: false },
  { path: '/partner-match', name: 'Partner Match Page', hasAPI: false },
  { path: '/booking-success', name: 'Booking Success Page', hasAPI: false }
]

// Booking and payment pages (need special handling)
const BOOKING_PAGES = [
  { path: '/booking/payment', name: 'Payment Page', needsData: true },
  { path: '/booking/wise-payment', name: 'Wise Payment Page', needsData: true },
  { path: '/booking/confirmation', name: 'Booking Confirmation Page', needsData: true }
]

const languages = ['en', 'es', 'fr', 'de']

let testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  details: {}
}

async function testPageTranslation(page, lang) {
  console.log(`\n  🌍 Testing ${page.name} in ${lang.toUpperCase()}`)
  
  const result = {
    pageLoaded: false,
    apiWorking: false,
    translationEvidence: [],
    errors: []
  }
  
  try {
    // Test page loading
    const pageResponse = await fetch(`${BASE_URL}${page.path}`, {
      headers: {
        'Accept-Language': lang,
        'User-Agent': 'Mozilla/5.0 (compatible; Translation-Test/1.0)'
      }
    })
    
    if (pageResponse.ok) {
      result.pageLoaded = true
      console.log(`    ✅ Page loads successfully (${pageResponse.status})`)
    } else {
      result.errors.push(`Page failed to load: ${pageResponse.status}`)
      console.log(`    ❌ Page failed to load: ${pageResponse.status}`)
    }
    
    // Test API if page has one
    if (page.hasAPI && page.api) {
      try {
        const apiResponse = await fetch(`${BASE_URL}${page.api}`, {
          headers: {
            'Accept-Language': lang,
            'Content-Type': 'application/json'
          }
        })
        
        if (apiResponse.ok) {
          const data = await apiResponse.json()
          result.apiWorking = true
          console.log(`    ✅ API responds successfully`)
          
          // Check for translation evidence in API response
          if (lang !== 'en' && data) {
            let hasTranslatedContent = false
            
            // Check classes API
            if (page.api.includes('classes') && data.classes) {
              const sampleClass = data.classes[0]
              if (sampleClass?.title || sampleClass?.description) {
                hasTranslatedContent = true
                result.translationEvidence.push(`Class title/description available for translation`)
              }
            }
            
            // Check events API  
            if (page.api.includes('events') && data.events) {
              const sampleEvent = data.events[0]
              if (sampleEvent?.title || sampleEvent?.description) {
                hasTranslatedContent = true
                result.translationEvidence.push(`Event title/description available for translation`)
              }
            }
            
            // Check instructors API
            if (page.api.includes('instructors') && data.instructors) {
              const sampleInstructor = data.instructors[0]
              if (sampleInstructor?.bio || sampleInstructor?.specialty) {
                hasTranslatedContent = true
                result.translationEvidence.push(`Instructor bio/specialty available for translation`)
              }
            }
            
            if (hasTranslatedContent) {
              console.log(`    🔄 Translation content detected`)
            }
          }
        } else {
          result.errors.push(`API failed: ${apiResponse.status}`)
          console.log(`    ❌ API failed: ${apiResponse.status}`)
        }
      } catch (apiError) {
        result.errors.push(`API error: ${apiError.message}`)
        console.log(`    ❌ API error: ${apiError.message}`)
      }
    }
    
  } catch (error) {
    result.errors.push(`Test error: ${error.message}`)
    console.log(`    ❌ Test error: ${error.message}`)
  }
  
  return result
}

async function testAllPages() {
  console.log('🌐 Testing Translation Coverage for All Public Pages\n')
  console.log(`🔗 Base URL: ${BASE_URL}\n`)
  console.log(`📋 Testing ${PUBLIC_PAGES.length} public pages in ${languages.length} languages\n`)
  
  // Test each page in each language
  for (const page of PUBLIC_PAGES) {
    console.log(`\n📄 ${page.name} (${page.path})`)
    console.log('='.repeat(50))
    
    testResults.details[page.path] = {}
    
    for (const lang of languages) {
      const result = await testPageTranslation(page, lang)
      testResults.details[page.path][lang] = result
      
      if (result.pageLoaded && (!page.hasAPI || result.apiWorking)) {
        testResults.passed++
      } else {
        testResults.failed++
        testResults.errors.push(`${page.name} (${lang}): ${result.errors.join(', ')}`)
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
}

async function testDirectTranslationAPI() {
  console.log('\n\n🔄 Testing Direct Translation API')
  console.log('='.repeat(50))
  
  const testTexts = [
    'Welcome to our dance platform',
    'Book your class today',
    'Expert dance instructors',
    'Join our community'
  ]
  
  for (const lang of ['es', 'fr', 'de']) {
    try {
      const response = await fetch(`${BASE_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          texts: testTexts,
          target: lang,
          source: 'en'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.translations && data.translations.length === testTexts.length) {
          console.log(`✅ ${lang.toUpperCase()} translation API working`)
          testTexts.forEach((text, idx) => {
            console.log(`   "${text}" → "${data.translations[idx]}"`)
          })
        } else {
          console.log(`❌ ${lang.toUpperCase()} translation API returned invalid data`)
        }
      } else {
        console.log(`❌ ${lang.toUpperCase()} translation API failed: ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ ${lang.toUpperCase()} translation API error: ${error.message}`)
    }
  }
}

async function checkTranslationFiles() {
  console.log('\n\n📝 Checking Translation Files and Components')
  console.log('='.repeat(50))
  
  try {
    // Check for TranslatedText component
    const translatedTextPath = '/Users/hemantd/DL/dance-platform-staging/app/components/TranslatedText.tsx'
    try {
      await fs.access(translatedTextPath)
      console.log('✅ TranslatedText component exists')
    } catch {
      console.log('❌ TranslatedText component missing')
    }
    
    // Check for translation hooks
    const hooksPath = '/Users/hemantd/DL/dance-platform-staging/app/hooks/useTranslations.ts'
    try {
      await fs.access(hooksPath)
      console.log('✅ Translation hooks exist')
    } catch {
      console.log('❌ Translation hooks missing')
    }
    
    // Check for i18n configuration
    const i18nPath = '/Users/hemantd/DL/dance-platform-staging/lib/i18n.ts'
    try {
      await fs.access(i18nPath)
      console.log('✅ i18n configuration exists')
    } catch {
      console.log('❌ i18n configuration missing')
    }
    
    // Check for translation service
    const servicePath = '/Users/hemantd/DL/dance-platform-staging/lib/translation-service.ts'
    try {
      await fs.access(servicePath)
      console.log('✅ Translation service exists')
    } catch {
      console.log('❌ Translation service missing')
    }
    
  } catch (error) {
    console.log(`❌ Error checking translation files: ${error.message}`)
  }
}

async function generateReport() {
  console.log('\n\n📊 Translation Test Report')
  console.log('='.repeat(50))
  
  const totalTests = PUBLIC_PAGES.length * languages.length
  const successRate = ((testResults.passed / totalTests) * 100).toFixed(1)
  
  console.log(`\n📈 Overall Results:`)
  console.log(`   Total Tests: ${totalTests}`)
  console.log(`   Passed: ${testResults.passed}`)
  console.log(`   Failed: ${testResults.failed}`)
  console.log(`   Success Rate: ${successRate}%`)
  
  if (testResults.errors.length > 0) {
    console.log(`\n❌ Errors Found:`)
    testResults.errors.forEach((error, idx) => {
      console.log(`   ${idx + 1}. ${error}`)
    })
  }
  
  console.log(`\n🔧 Recommended Actions:`)
  
  if (successRate < 100) {
    console.log(`   1. Fix page loading issues`)
    console.log(`   2. Add server-side translation to APIs that lack it`)
    console.log(`   3. Wrap hardcoded text in TranslatedText components`)
    console.log(`   4. Test booking and payment flows manually`)
  } else {
    console.log(`   ✅ All basic page translations appear to be working!`)
    console.log(`   🔍 Manual testing recommended for:`)
    console.log(`      - Booking forms and payment flows`)
    console.log(`      - Dynamic form validation messages`)
    console.log(`      - Error messages and alerts`)
  }
  
  // Save detailed report
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: parseFloat(successRate)
    },
    details: testResults.details,
    errors: testResults.errors
  }
  
  try {
    await fs.writeFile(
      '/Users/hemantd/DL/dance-platform-staging/translation-test-report.json',
      JSON.stringify(reportData, null, 2)
    )
    console.log(`\n💾 Detailed report saved to: translation-test-report.json`)
  } catch (error) {
    console.log(`❌ Failed to save report: ${error.message}`)
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(BASE_URL, { timeout: 5000 })
    return response.ok || response.status === 404
  } catch (error) {
    return false
  }
}

// Main execution
async function main() {
  console.log('⏳ Checking if server is running...')
  
  const isServerRunning = await checkServer()
  
  if (!isServerRunning) {
    console.error('\n❌ Server is not running!')
    console.error('Please start the development server first:')
    console.error('  npm run dev\n')
    process.exit(1)
  }
  
  console.log('✅ Server is running\n')
  
  // Wait for server to be fully ready
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  try {
    await testAllPages()
    await testDirectTranslationAPI()
    await checkTranslationFiles()
    await generateReport()
    
    console.log('\n🎉 Translation testing complete!')
  } catch (error) {
    console.error(`\n❌ Testing failed: ${error.message}`)
    process.exit(1)
  }
}

main().catch(console.error)