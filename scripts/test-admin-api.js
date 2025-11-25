const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAdminAPI() {
  try {
    console.log('🔍 Testing admin API access...')
    
    // First, let's check if we can connect to the database directly
    await prisma.$connect()
    console.log('✅ Connected to database')
    
    // Test fetching instructors content directly from database
    const instructorsContent = await prisma.instructorsPageContent.findUnique({
      where: { id: 'instructors' }
    })
    
    if (instructorsContent) {
      console.log('✅ Instructors content found in database:')
      console.log('ID:', instructorsContent.id)
      console.log('Hero Title:', instructorsContent.heroTitle)
      console.log('Hero Features:', instructorsContent.heroFeatures)
      console.log('Updated At:', instructorsContent.updatedAt)
    } else {
      console.log('❌ No instructors content found in database')
    }
    
    console.log('\n✅ Direct database test complete!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testAdminAPI()