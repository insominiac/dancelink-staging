const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function initContent() {
  try {
    console.log('🔄 Connecting to database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to Railway PostgreSQL')

    // Initialize About Page Content
    console.log('\n📄 Initializing About Page content...')
    const aboutContent = await prisma.aboutPageContent.upsert({
      where: { id: 'about' },
      update: {
        heroTitle: 'About DanceLink',
        heroSubtitle: 'Connecting dancers through the universal language of movement.',
        heroBadgeText: 'Our Story & Mission',
        storyTitle: 'Our Story',
        storyDescription1: 'DanceLink was founded with a simple belief: everyone deserves to experience the joy and connection that comes from dance.',
        storyDescription2: 'Our mission is to make dance accessible, welcoming, and transformative for people of all backgrounds.',
      },
      create: {
        id: 'about',
        heroTitle: 'About DanceLink',
        heroSubtitle: 'Connecting dancers through the universal language of movement.',
        heroBadgeText: 'Our Story & Mission',
        storyTitle: 'Our Story',
        storyDescription1: 'DanceLink was founded with a simple belief: everyone deserves to experience the joy and connection that comes from dance.',
        storyDescription2: 'Our mission is to make dance accessible, welcoming, and transformative for people of all backgrounds.',
      },
    })
    console.log('✅ About page content saved:', aboutContent.id)

    // Check if data exists
    console.log('\n🔍 Verifying data in database...')
    const check = await prisma.aboutPageContent.findUnique({
      where: { id: 'about' }
    })
    
    if (check) {
      console.log('✅ Data verified in database!')
      console.log('   Hero Title:', check.heroTitle)
      console.log('   Updated At:', check.updatedAt)
    } else {
      console.log('❌ Data not found in database')
    }

    // List all tables with data
    console.log('\n📊 Checking content tables...')
    const homepageCount = await prisma.homepageContent.count()
    const aboutCount = await prisma.aboutPageContent.count()
    const eventsCount = await prisma.eventsPageContent.count()
    const instructorsCount = await prisma.instructorsPageContent.count()
    const contactCount = await prisma.contactPageContent.count()
    
    console.log('   Homepage content records:', homepageCount)
    console.log('   About content records:', aboutCount)
    console.log('   Events content records:', eventsCount)
    console.log('   Instructors content records:', instructorsCount)
    console.log('   Contact content records:', contactCount)

    console.log('\n✅ Content initialization complete!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

initContent()
