const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkInstructorsContent() {
  try {
    console.log('🔍 Checking instructors content in database...')
    
    // Check if instructors content exists
    const instructorsContent = await prisma.instructorsPageContent.findUnique({
      where: { id: 'instructors' }
    })
    
    if (instructorsContent) {
      console.log('✅ Instructors content found:')
      console.log('ID:', instructorsContent.id)
      console.log('Hero Badge Text:', instructorsContent.heroBadgeText)
      console.log('Hero Title:', instructorsContent.heroTitle)
      console.log('Hero Subtitle:', instructorsContent.heroSubtitle)
      console.log('Hero Features:', instructorsContent.heroFeatures)
      console.log('Stats Section:', instructorsContent.statsSection)
      console.log('No Instructors Section:', instructorsContent.noInstructorsSection)
      console.log('Error Section:', instructorsContent.errorSection)
      console.log('CTA Section:', instructorsContent.ctaSection)
      console.log('Created At:', instructorsContent.createdAt)
      console.log('Updated At:', instructorsContent.updatedAt)
    } else {
      console.log('❌ No instructors content found in database')
    }
  } catch (error) {
    console.error('❌ Error checking instructors content:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkInstructorsContent()