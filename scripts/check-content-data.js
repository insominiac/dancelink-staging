const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkContentData() {
  try {
    console.log('🔍 Checking content data...')
    
    // Check homepage content
    const homepageContent = await prisma.homepageContent.findUnique({
      where: { id: 'default' }
    })
    
    if (homepageContent) {
      console.log('📄 Homepage Content:')
      console.log(`  Title: ${homepageContent.heroTitle}`)
      console.log(`  Subtitle: ${homepageContent.heroSubtitle}`)
      console.log(`  Button Text: ${homepageContent.heroButtonText}`)
      console.log(`  Background Image: ${homepageContent.heroBackgroundImage}`)
    } else {
      console.log('❌ No homepage content found')
    }
    
    // Check events page content
    const eventsContent = await prisma.eventsPageContent.findUnique({
      where: { id: 'default' }
    })
    
    if (eventsContent) {
      console.log('\n📅 Events Page Content:')
      console.log(`  Title: ${eventsContent.heroTitle}`)
      console.log(`  Subtitle: ${eventsContent.heroSubtitle}`)
      console.log(`  Featured Title: ${eventsContent.featuredTitle}`)
    } else {
      console.log('❌ No events content found')
    }
    
    // Check about page content
    const aboutContent = await prisma.aboutPageContent.findUnique({
      where: { id: 'default' }
    })
    
    if (aboutContent) {
      console.log('\n📖 About Page Content:')
      console.log(`  Title: ${aboutContent.heroTitle}`)
      console.log(`  Subtitle: ${aboutContent.heroSubtitle}`)
      console.log(`  Story Title: ${aboutContent.storyTitle}`)
    } else {
      console.log('❌ No about content found')
    }
    
    console.log('\n✅ Content data verification complete!')
    
  } catch (error) {
    console.error('❌ Error checking content data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkContentData()