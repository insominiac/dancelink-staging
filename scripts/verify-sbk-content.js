const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifySBKContent() {
  try {
    console.log('🔍 Verifying SBK content...')
    
    // Find the SBK style with all its fields
    const sbkStyle = await prisma.danceStyle.findFirst({
      where: {
        name: {
          contains: 'SBK'
        }
      }
    })
    
    if (!sbkStyle) {
      console.log('❌ SBK dance style not found')
      return
    }
    
    console.log(`✅ SBK Style Verification:`)
    console.log(`  ID: ${sbkStyle.id}`)
    console.log(`  Name: ${sbkStyle.name}`)
    console.log(`  Icon: ${sbkStyle.icon}`)
    console.log(`  Subtitle: ${sbkStyle.subtitle}`)
    console.log(`  Category: ${sbkStyle.category}`)
    console.log(`  Difficulty: ${sbkStyle.difficulty}`)
    console.log(`  Origin: ${sbkStyle.origin}`)
    console.log(`  Music Style: ${sbkStyle.musicStyle}`)
    console.log(`  Price: ${sbkStyle.price}`)
    console.log(`  Instructors: ${sbkStyle.instructors}`)
    console.log(`  Is Active: ${sbkStyle.isActive}`)
    console.log(`  Is Featured: ${sbkStyle.isFeatured}`)
    console.log(`  Sort Order: ${sbkStyle.sortOrder}`)
    
    // Show a snippet of the description
    if (sbkStyle.description) {
      console.log(`  Description: ${sbkStyle.description.substring(0, 100)}...`)
    }
    
    // Parse and show characteristics
    if (sbkStyle.characteristics) {
      const characteristics = JSON.parse(sbkStyle.characteristics)
      console.log(`  Characteristics: ${characteristics.join(', ')}`)
    }
    
    // Parse and show benefits
    if (sbkStyle.benefits) {
      const benefits = JSON.parse(sbkStyle.benefits)
      console.log(`  Benefits: ${benefits.join(', ')}`)
    }
    
    // Check original styles
    const originalStyles = await prisma.danceStyle.findMany({
      where: {
        name: {
          in: ['Salsa', 'Bachata', 'Kizomba']
        }
      },
      select: {
        name: true,
        isActive: true
      }
    })
    
    console.log(`\n🔄 Original Styles Status:`)
    originalStyles.forEach(style => {
      console.log(`  ${style.name}: ${style.isActive ? '✅ Active' : '❌ Inactive'}`)
    })
    
    console.log('\n🎉 SBK content verification complete!')
    
  } catch (error) {
    console.error('❌ Error verifying SBK content:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifySBKContent()