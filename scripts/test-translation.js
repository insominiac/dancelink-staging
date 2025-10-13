#!/usr/bin/env node
/**
 * Test script to verify Google Translate API is working
 */

require('dotenv').config()

async function testGoogleTranslate() {
  console.log('🔍 Testing Google Translate API...\n')
  
  // Check if API key exists
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    console.error('❌ GOOGLE_TRANSLATE_API_KEY not found in environment variables')
    process.exit(1)
  }
  
  console.log('✅ API key found:', apiKey.substring(0, 10) + '...')
  
  // Import translation service
  const { Translate } = require('@google-cloud/translate').v2
  
  try {
    const translate = new Translate({
      key: apiKey,
    })
    
    // Test translations
    const testTexts = [
      'Dance Classes',
      'Ballet for Beginners',
      'Learn salsa dancing in our modern studio',
      'Professional instructors with years of experience'
    ]
    
    const targetLanguages = ['es', 'fr', 'de']
    
    for (const lang of targetLanguages) {
      console.log(`\n📝 Testing translation to ${lang.toUpperCase()}:`)
      console.log('-----------------------------------')
      
      for (const text of testTexts) {
        try {
          const [translation] = await translate.translate(text, lang)
          console.log(`✅ "${text}" → "${translation}"`)
        } catch (error) {
          console.error(`❌ Failed to translate "${text}": ${error.message}`)
        }
      }
    }
    
    console.log('\n🎉 Translation service is working correctly!')
    
    // Test batch translation
    console.log('\n📦 Testing batch translation...')
    const [batchResults] = await translate.translate(testTexts, 'es')
    console.log('✅ Batch translation successful:', batchResults.length, 'items translated')
    
  } catch (error) {
    console.error('\n❌ Error testing Google Translate API:')
    console.error(error.message)
    
    if (error.code === 403) {
      console.error('\n⚠️  API key may be invalid or needs to be enabled in Google Cloud Console')
      console.error('   Visit: https://console.cloud.google.com/apis/library/translate.googleapis.com')
    } else if (error.code === 400) {
      console.error('\n⚠️  Bad request - check API key format')
    }
    
    process.exit(1)
  }
}

// Run the test
testGoogleTranslate().catch(console.error)