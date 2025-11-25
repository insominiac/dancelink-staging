const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateInstructorsContent() {
  try {
    console.log('🔄 Connecting to database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to database')

    // Default hero features
    const defaultHeroFeatures = [
      { icon: "🎭", text: "Expert Instructors" },
      { icon: "💃", text: "Variety of Styles" },
      { icon: "🎪", text: "Fun Atmosphere" }
    ]

    console.log('\n📝 Updating instructors content with hero features...')
    const updatedContent = await prisma.instructorsPageContent.update({
      where: { id: 'instructors' },
      data: {
        heroFeatures: defaultHeroFeatures
      }
    })
    
    console.log('✅ Instructors content updated with hero features')
    console.log('Hero Features:', updatedContent.heroFeatures)
    console.log('Updated At:', updatedContent.updatedAt)

    console.log('\n✅ Update complete!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

updateInstructorsContent()