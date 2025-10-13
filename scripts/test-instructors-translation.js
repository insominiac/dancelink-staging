#!/usr/bin/env node
/**
 * Test script to verify instructors page translation functionality
 */

const fetch = require('node-fetch')

const PORT = process.env.PORT || 3000
const BASE_URL = `http://localhost:${PORT}`

async function testInstructorsTranslation() {
  console.log('🧑‍🏫 Testing Instructors Page Translation...\n')
  console.log(`🌐 Server URL: ${BASE_URL}\n`)
  
  const languages = ['en', 'es', 'fr', 'de']
  
  try {
    for (const lang of languages) {
      console.log(`\n🌍 Language: ${lang.toUpperCase()}`)
      console.log('-----------------------------------')
      
      try {
        const response = await fetch(`${BASE_URL}/api/public/instructors`, {
          headers: {
            'Accept-Language': lang,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.instructors && data.instructors.length > 0) {
          // Show first 2 instructors as examples
          const sample = data.instructors.slice(0, 2)
          
          sample.forEach((instructor, idx) => {
            console.log(`\n  Instructor ${idx + 1}:`)
            console.log(`    Name: ${instructor.name || 'N/A'}`)
            console.log(`    Bio: ${instructor.bio ? instructor.bio.substring(0, 80) + '...' : 'N/A'}`)
            console.log(`    Specialty: ${instructor.specialty || 'N/A'}`)
            console.log(`    Experience: ${instructor.experienceYears ? instructor.experienceYears + ' years' : 'N/A'}`)
            console.log(`    Classes: ${instructor.classCount || 0}`)
            
            if (instructor.activeClasses && instructor.activeClasses.length > 0) {
              console.log(`    Sample Class: "${instructor.activeClasses[0].title}"`)
            }
          })
          
          console.log(`\n  ✅ Total instructors retrieved: ${data.instructors.length}`)
        } else {
          console.log('  ⚠️  No instructors found in database')
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to fetch instructors: ${error.message}`)
      }
    }
    
    console.log('\n\n🎉 Instructors page translation test complete!')
    console.log('\n📝 Summary:')
    console.log('  - Instructor bios should be translated server-side')
    console.log('  - Instructor specialties should be translated')
    console.log('  - Class titles should be translated')
    console.log('  - Static UI text uses TranslatedText component for client-side translation')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    process.exit(1)
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(BASE_URL)
    return response.ok || response.status === 404  // 404 is ok, means server is running
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
  
  // Wait a moment for server to be fully ready
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  await testInstructorsTranslation()
}

main().catch(console.error)