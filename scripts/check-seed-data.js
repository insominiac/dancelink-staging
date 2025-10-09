const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkData() {
  console.log('📊 Checking seeded data...\n')

  try {
    // Check users
    const userCounts = await Promise.all([
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
      prisma.user.count({ where: { role: 'USER' } })
    ])
    
    console.log('👥 USERS:')
    console.log(`   Admins: ${userCounts[0]}`)
    console.log(`   Instructors: ${userCounts[1]}`)
    console.log(`   Students: ${userCounts[2]}`)
    console.log(`   Total: ${userCounts[0] + userCounts[1] + userCounts[2]}`)

    // Check dance styles
    const danceStyles = await prisma.danceStyle.findMany({
      select: { name: true, category: true, isFeatured: true }
    })
    
    console.log('\n💃 DANCE STYLES:')
    danceStyles.forEach(style => {
      console.log(`   ${style.isFeatured ? '⭐' : '  '} ${style.name} (${style.category})`)
    })

    // Check venues
    const venues = await prisma.venue.findMany({
      select: { name: true, city: true }
    })
    
    console.log('\n🏢 VENUES:')
    venues.forEach(venue => {
      console.log(`   📍 ${venue.name} - ${venue.city}`)
    })

    // Check classes
    const classes = await prisma.class.findMany({
      select: { 
        title: true, 
        level: true, 
        price: true, 
        status: true,
        classInstructors: {
          include: {
            instructor: {
              include: {
                user: { select: { fullName: true } }
              }
            }
          }
        }
      }
    })
    
    console.log('\n📚 CLASSES:')
    classes.forEach(cls => {
      const instructor = cls.classInstructors[0]?.instructor.user.fullName || 'No instructor'
      console.log(`   📖 ${cls.title} (${cls.level}) - $${cls.price} - ${instructor}`)
    })

    // Check events
    const events = await prisma.event.findMany({
      select: { 
        title: true, 
        eventType: true, 
        price: true, 
        isFeatured: true,
        startDate: true,
        organizer: { select: { fullName: true } }
      }
    })
    
    console.log('\n🎉 EVENTS:')
    events.forEach(event => {
      const date = event.startDate.toLocaleDateString()
      console.log(`   ${event.isFeatured ? '⭐' : '  '} ${event.title} (${event.eventType}) - $${event.price} - ${date}`)
    })

    // Check bookings
    const bookingCounts = await Promise.all([
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { classId: { not: null } } }),
      prisma.booking.count({ where: { eventId: { not: null } } })
    ])
    
    console.log('\n📝 BOOKINGS:')
    console.log(`   Confirmed: ${bookingCounts[0]}`)
    console.log(`   Pending: ${bookingCounts[1]}`)
    console.log(`   Class bookings: ${bookingCounts[2]}`)
    console.log(`   Event bookings: ${bookingCounts[3]}`)

    // Check testimonials
    const testimonials = await prisma.testimonial.findMany({
      select: { 
        rating: true, 
        message: true, 
        isFeatured: true,
        user: { select: { fullName: true } }
      }
    })
    
    console.log('\n⭐ TESTIMONIALS:')
    testimonials.forEach(testimonial => {
      const stars = '⭐'.repeat(testimonial.rating)
      const featured = testimonial.isFeatured ? ' 🌟 FEATURED' : ''
      console.log(`   ${stars} ${testimonial.user.fullName}${featured}`)
      console.log(`      "${testimonial.message.substring(0, 80)}..."`)
    })

    console.log('\n✅ Data verification complete!')

  } catch (error) {
    console.error('❌ Error checking data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()