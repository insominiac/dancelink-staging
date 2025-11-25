const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function populateSBKContent() {
  try {
    console.log('🎨 Populating rich content for SBK dance style...')
    
    // Find the SBK style
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
    
    console.log(`📝 Updating SBK style: ${sbkStyle.name}`)
    
    // Update SBK with rich content
    const updatedStyle = await prisma.danceStyle.update({
      where: { id: sbkStyle.id },
      data: {
        icon: '💃',
        subtitle: 'Salsa, Bachata & Kizomba',
        description: 'Experience the passion and rhythm of Latin and African dance with our comprehensive SBK program! This unique combination brings together three of the most popular social dances in the world. Salsa for its energetic and vibrant movements, Bachata for its intimate and romantic connection, and Kizomba for its smooth and sensual flow. Our expert instructors will guide you through the fundamentals of each style while helping you develop the musicality and connection that makes these dances so captivating.',
        difficulty: 'Beginner-Friendly',
        origin: 'Latin America & Africa',
        musicStyle: 'Latin/African',
        characteristics: JSON.stringify([
          'Energetic and passionate',
          'Partner connection focused',
          'Musicality development',
          'Social and fun',
          'Improves coordination'
        ]),
        benefits: JSON.stringify([
          'Build confidence on the dance floor',
          'Meet new people in a social setting',
          'Improve fitness and coordination',
          'Develop musicality and rhythm',
          'Enhance partner connection skills'
        ]),
        price: '$45/class',
        instructors: 'Carlos & Maria',
        category: 'Latin/African',
        isFeatured: true,
        sortOrder: 1
      }
    })
    
    console.log(`✅ Successfully updated SBK style with rich content`)
    console.log(`  Name: ${updatedStyle.name}`)
    console.log(`  Category: ${updatedStyle.category}`)
    console.log(`  Featured: ${updatedStyle.isFeatured}`)
    console.log(`  Sort Order: ${updatedStyle.sortOrder}`)
    
    // Also update the original Salsa, Bachata, and Kizomba styles to ensure they're properly deactivated
    const originalStyles = await prisma.danceStyle.updateMany({
      where: {
        name: {
          in: ['Salsa', 'Bachata', 'Kizomba']
        }
      },
      data: {
        isActive: false
      }
    })
    
    console.log(`✅ Deactivated ${originalStyles.count} original styles`)
    
    console.log('\n🎉 SBK content population complete!')
    console.log('🔥 The SBK dance style is now ready for the public site!')
    
  } catch (error) {
    console.error('❌ Error populating SBK content:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateSBKContent()