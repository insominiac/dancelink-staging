const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDanceStyles() {
  try {
    console.log('🔍 Checking dance styles...')
    
    const danceStyles = await prisma.danceStyle.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`\n📋 Found ${danceStyles.length} dance styles:`)
    danceStyles.forEach(style => {
      console.log(`  ${style.isActive ? '✅' : '❌'} ${style.name} (${style.category}) - ${style.isFeatured ? 'Featured' : 'Not Featured'}`)
    })
    
    // Check specifically for SBK style
    const sbkStyle = danceStyles.find(style => style.name.includes('SBK'))
    if (sbkStyle) {
      console.log(`\n🎯 SBK Style Details:`)
      console.log(`  ID: ${sbkStyle.id}`)
      console.log(`  Name: ${sbkStyle.name}`)
      console.log(`  Category: ${sbkStyle.category}`)
      console.log(`  Active: ${sbkStyle.isActive}`)
      console.log(`  Featured: ${sbkStyle.isFeatured}`)
      console.log(`  Sort Order: ${sbkStyle.sortOrder}`)
    }
    
  } catch (error) {
    console.error('❌ Error checking dance styles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDanceStyles()