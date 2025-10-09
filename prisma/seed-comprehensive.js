const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive database seed...')

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Cleaning existing data...')
    
    // Delete in reverse dependency order
    await prisma.userStyle.deleteMany()
    await prisma.classStyle.deleteMany()
    await prisma.eventStyle.deleteMany()
    await prisma.classInstructor.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.testimonial.deleteMany()
    await prisma.instructor.deleteMany()
    await prisma.class.deleteMany()
    await prisma.event.deleteMany()
    await prisma.venue.deleteMany()
    await prisma.danceStyle.deleteMany()
    await prisma.user.deleteMany()

    // ================== CREATE USERS ==================
    console.log('👥 Creating users...')
    
    // Admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@danceplatform.com',
        passwordHash: adminPassword,
        fullName: 'Admin User',
        role: 'ADMIN',
        isVerified: true
      }
    })

    // Instructor users
    const instructorPassword = await bcrypt.hash('instructor123', 10)
    const instructor1 = await prisma.user.create({
      data: {
        email: 'sarah.johnson@danceplatform.com',
        passwordHash: instructorPassword,
        fullName: 'Sarah Johnson',
        role: 'INSTRUCTOR',
        phone: '+1234567890',
        bio: 'Professional ballet and contemporary dance instructor with 10+ years of experience.',
        isVerified: true,
        profileImage: '/images/instructors/sarah.jpg'
      }
    })

    const instructor2 = await prisma.user.create({
      data: {
        email: 'maria.rodriguez@danceplatform.com',
        passwordHash: instructorPassword,
        fullName: 'Maria Rodriguez',
        role: 'INSTRUCTOR',
        phone: '+1234567891',
        bio: 'Salsa and Latin dance expert. Former competitive dancer and choreographer.',
        isVerified: true,
        profileImage: '/images/instructors/maria.jpg'
      }
    })

    const instructor3 = await prisma.user.create({
      data: {
        email: 'jason.lee@danceplatform.com',
        passwordHash: instructorPassword,
        fullName: 'Jason Lee',
        role: 'INSTRUCTOR',
        phone: '+1234567892',
        bio: 'Hip hop and street dance specialist. Choreographer for music videos and shows.',
        isVerified: true,
        profileImage: '/images/instructors/jason.jpg'
      }
    })

    // Student users
    const studentPassword = await bcrypt.hash('student123', 10)
    const students = []
    const studentData = [
      { email: 'john.smith@email.com', fullName: 'John Smith', phone: '+1234567893' },
      { email: 'emma.wilson@email.com', fullName: 'Emma Wilson', phone: '+1234567894' },
      { email: 'michael.brown@email.com', fullName: 'Michael Brown', phone: '+1234567895' },
      { email: 'sophia.davis@email.com', fullName: 'Sophia Davis', phone: '+1234567896' },
      { email: 'william.jones@email.com', fullName: 'William Jones', phone: '+1234567897' },
      { email: 'olivia.miller@email.com', fullName: 'Olivia Miller', phone: '+1234567898' }
    ]

    for (const student of studentData) {
      const user = await prisma.user.create({
        data: {
          email: student.email,
          passwordHash: studentPassword,
          fullName: student.fullName,
          phone: student.phone,
          role: 'USER',
          isVerified: true
        }
      })
      students.push(user)
    }

    console.log(`✅ Created ${1 + 3 + students.length} users (1 admin, 3 instructors, ${students.length} students)`)

    // ================== CREATE DANCE STYLES ==================
    console.log('💃 Creating dance styles...')
    
    const danceStyles = [
      {
        name: 'Ballet',
        category: 'Classical',
        description: 'Classical ballet technique focusing on grace, precision, and artistry.',
        difficulty: 'Beginner to Advanced',
        origin: 'France',
        musicStyle: 'Classical',
        characteristics: 'Structured, technical, graceful',
        benefits: 'Improves posture, flexibility, strength, and coordination',
        schedule: 'Mon/Wed/Fri 6:00 PM',
        price: '$35 per class',
        instructors: 'Sarah Johnson',
        icon: '🩰',
        isFeatured: true,
        sortOrder: 1
      },
      {
        name: 'Salsa',
        category: 'Latin',
        description: 'Energetic partner dance with roots in Cuban son and mambo.',
        difficulty: 'Beginner to Advanced',
        origin: 'Cuba',
        musicStyle: 'Latin',
        characteristics: 'Partner-based, rhythmic, passionate',
        benefits: 'Cardio workout, social skills, rhythm development',
        schedule: 'Tue/Thu 7:00 PM',
        price: '$25 per class',
        instructors: 'Maria Rodriguez',
        icon: '💃',
        isFeatured: true,
        sortOrder: 2
      },
      {
        name: 'Hip Hop',
        category: 'Street',
        description: 'Urban dance style expressing creativity and individuality.',
        difficulty: 'Beginner to Advanced',
        origin: 'United States',
        musicStyle: 'Hip Hop, Rap, R&B',
        characteristics: 'Freestyle, expressive, energetic',
        benefits: 'Self-expression, cardio, coordination',
        schedule: 'Mon/Wed 8:00 PM',
        price: '$30 per class',
        instructors: 'Jason Lee',
        icon: '🕺',
        isFeatured: true,
        sortOrder: 3
      },
      {
        name: 'Contemporary',
        category: 'Modern',
        description: 'Fluid dance style combining elements of ballet, jazz, and modern dance.',
        difficulty: 'Intermediate to Advanced',
        origin: 'United States',
        musicStyle: 'Contemporary, Alternative',
        characteristics: 'Emotional, fluid, interpretive',
        benefits: 'Emotional expression, flexibility, creativity',
        schedule: 'Tue/Sat 5:00 PM',
        price: '$32 per class',
        instructors: 'Sarah Johnson',
        icon: '🌊',
        isFeatured: false,
        sortOrder: 4
      },
      {
        name: 'Jazz',
        category: 'Contemporary',
        description: 'High-energy dance style with sharp movements and theatrical flair.',
        difficulty: 'Beginner to Advanced',
        origin: 'United States',
        musicStyle: 'Jazz, Musical Theatre',
        characteristics: 'Sharp, theatrical, dynamic',
        benefits: 'Performance skills, flexibility, strength',
        schedule: 'Wed/Fri 6:30 PM',
        price: '$28 per class',
        instructors: 'Sarah Johnson',
        icon: '🎭',
        isFeatured: false,
        sortOrder: 5
      },
      {
        name: 'Bachata',
        category: 'Latin',
        description: 'Romantic Latin dance with close partner connection.',
        difficulty: 'Beginner to Intermediate',
        origin: 'Dominican Republic',
        musicStyle: 'Bachata',
        characteristics: 'Romantic, close-hold, sensual',
        benefits: 'Partner connection, rhythm, romance',
        schedule: 'Thu/Sat 7:30 PM',
        price: '$25 per class',
        instructors: 'Maria Rodriguez',
        icon: '❤️',
        isFeatured: false,
        sortOrder: 6
      }
    ]

    const createdDanceStyles = []
    for (const style of danceStyles) {
      const danceStyle = await prisma.danceStyle.create({
        data: style
      })
      createdDanceStyles.push(danceStyle)
    }

    console.log(`✅ Created ${createdDanceStyles.length} dance styles`)

    // ================== CREATE INSTRUCTORS ==================
    console.log('👨‍🏫 Creating instructor profiles...')
    
    const instructorProfiles = await Promise.all([
      prisma.instructor.create({
        data: {
          userId: instructor1.id,
          specialty: 'Ballet, Contemporary, Jazz',
          experienceYears: 12,
          rating: 4.8,
          isActive: true
        }
      }),
      prisma.instructor.create({
        data: {
          userId: instructor2.id,
          specialty: 'Salsa, Bachata, Latin Dances',
          experienceYears: 8,
          rating: 4.9,
          isActive: true
        }
      }),
      prisma.instructor.create({
        data: {
          userId: instructor3.id,
          specialty: 'Hip Hop, Street Dance, Choreography',
          experienceYears: 6,
          rating: 4.7,
          isActive: true
        }
      })
    ])

    console.log(`✅ Created ${instructorProfiles.length} instructor profiles`)

    // ================== CREATE VENUES ==================
    console.log('🏢 Creating venues...')
    
    const venues = await Promise.all([
      prisma.venue.create({
        data: {
          name: 'Downtown Dance Studio',
          addressLine1: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          postalCode: '94101',
          phone: '+1234567800',
          websiteUrl: 'https://downtowndancestudio.com',
          latitude: 37.7749,
          longitude: -122.4194
        }
      }),
      prisma.venue.create({
        data: {
          name: 'Artistry Dance Center',
          addressLine1: '456 Dance Avenue',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          postalCode: '94102',
          phone: '+1234567801',
          websiteUrl: 'https://artistrydance.com',
          latitude: 37.7849,
          longitude: -122.4094
        }
      }),
      prisma.venue.create({
        data: {
          name: 'Movement Studio',
          addressLine1: '789 Rhythm Road',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          postalCode: '94103',
          phone: '+1234567802',
          latitude: 37.7649,
          longitude: -122.4294
        }
      })
    ])

    console.log(`✅ Created ${venues.length} venues`)

    // ================== CREATE CLASSES ==================
    console.log('📚 Creating classes...')
    
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const classes = [
      {
        title: 'Ballet Fundamentals',
        description: 'Learn the basic positions, movements, and technique of classical ballet. Perfect for beginners who want to build a strong foundation.',
        level: 'Beginner',
        durationMins: 60,
        maxCapacity: 15,
        price: 35.00,
        scheduleDays: 'Monday, Wednesday, Friday',
        scheduleTime: '18:00',
        requirements: 'Ballet shoes required, leotard recommended',
        imageUrl: '/images/classes/ballet-fundamentals.jpg',
        startDate: nextWeek,
        endDate: nextMonth,
        venueId: venues[0].id,
        status: 'PUBLISHED'
      },
      {
        title: 'Advanced Ballet Technique',
        description: 'Refine your ballet technique with advanced combinations, pointe work preparation, and artistic expression.',
        level: 'Advanced',
        durationMins: 90,
        maxCapacity: 12,
        price: 50.00,
        scheduleDays: 'Tuesday, Thursday',
        scheduleTime: '17:00',
        requirements: 'Minimum 2 years ballet experience, pointe shoes for advanced students',
        imageUrl: '/images/classes/advanced-ballet.jpg',
        startDate: nextWeek,
        endDate: nextMonth,
        venueId: venues[0].id,
        status: 'PUBLISHED'
      },
      {
        title: 'Salsa for Beginners',
        description: 'Learn the basic steps, timing, and partner connection in this fun and social salsa class.',
        level: 'Beginner',
        durationMins: 60,
        maxCapacity: 20,
        price: 25.00,
        scheduleDays: 'Tuesday, Thursday',
        scheduleTime: '19:00',
        requirements: 'Comfortable shoes with smooth soles',
        imageUrl: '/images/classes/salsa-beginners.jpg',
        startDate: nextWeek,
        endDate: nextMonth,
        venueId: venues[1].id,
        status: 'PUBLISHED'
      },
      {
        title: 'Hip Hop Basics',
        description: 'Get down with the fundamentals of hip hop dance including isolations, grooves, and basic choreography.',
        level: 'Beginner',
        durationMins: 75,
        maxCapacity: 18,
        price: 30.00,
        scheduleDays: 'Monday, Wednesday',
        scheduleTime: '20:00',
        requirements: 'Comfortable athletic wear and sneakers',
        imageUrl: '/images/classes/hip-hop-basics.jpg',
        startDate: nextWeek,
        endDate: nextMonth,
        venueId: venues[2].id,
        status: 'PUBLISHED'
      },
      {
        title: 'Contemporary Expression',
        description: 'Explore emotional storytelling through movement with contemporary dance techniques and improvisation.',
        level: 'Intermediate',
        durationMins: 75,
        maxCapacity: 14,
        price: 32.00,
        scheduleDays: 'Tuesday, Saturday',
        scheduleTime: '17:00',
        requirements: 'Some dance experience recommended, bare feet or foot undies',
        imageUrl: '/images/classes/contemporary.jpg',
        startDate: nextWeek,
        endDate: nextMonth,
        venueId: venues[0].id,
        status: 'PUBLISHED'
      },
      {
        title: 'Jazz Funk Intensive',
        description: 'High-energy jazz funk class combining sharp jazz technique with funky grooves and attitude.',
        level: 'Intermediate',
        durationMins: 60,
        maxCapacity: 16,
        price: 28.00,
        scheduleDays: 'Wednesday, Friday',
        scheduleTime: '18:30',
        requirements: 'Jazz shoes or sneakers, previous dance experience helpful',
        imageUrl: '/images/classes/jazz-funk.jpg',
        startDate: nextWeek,
        endDate: nextMonth,
        venueId: venues[1].id,
        status: 'PUBLISHED'
      }
    ]

    const createdClasses = []
    for (const classData of classes) {
      const createdClass = await prisma.class.create({
        data: classData
      })
      createdClasses.push(createdClass)
    }

    console.log(`✅ Created ${createdClasses.length} classes`)

    // ================== CREATE CLASS-INSTRUCTOR RELATIONSHIPS ==================
    console.log('👥 Assigning instructors to classes...')
    
    const classInstructorAssignments = [
      { classId: createdClasses[0].id, instructorId: instructorProfiles[0].id, isPrimary: true }, // Ballet Fundamentals - Sarah
      { classId: createdClasses[1].id, instructorId: instructorProfiles[0].id, isPrimary: true }, // Advanced Ballet - Sarah
      { classId: createdClasses[2].id, instructorId: instructorProfiles[1].id, isPrimary: true }, // Salsa Beginners - Maria
      { classId: createdClasses[3].id, instructorId: instructorProfiles[2].id, isPrimary: true }, // Hip Hop Basics - Jason
      { classId: createdClasses[4].id, instructorId: instructorProfiles[0].id, isPrimary: true }, // Contemporary - Sarah
      { classId: createdClasses[5].id, instructorId: instructorProfiles[0].id, isPrimary: true }  // Jazz Funk - Sarah
    ]

    for (const assignment of classInstructorAssignments) {
      await prisma.classInstructor.create({
        data: assignment
      })
    }

    console.log(`✅ Created ${classInstructorAssignments.length} class-instructor assignments`)

    // ================== CREATE CLASS-STYLE RELATIONSHIPS ==================
    console.log('🎨 Linking classes to dance styles...')
    
    const classStyleAssignments = [
      { classId: createdClasses[0].id, styleId: createdDanceStyles[0].id }, // Ballet Fundamentals - Ballet
      { classId: createdClasses[1].id, styleId: createdDanceStyles[0].id }, // Advanced Ballet - Ballet
      { classId: createdClasses[2].id, styleId: createdDanceStyles[1].id }, // Salsa Beginners - Salsa
      { classId: createdClasses[3].id, styleId: createdDanceStyles[2].id }, // Hip Hop Basics - Hip Hop
      { classId: createdClasses[4].id, styleId: createdDanceStyles[3].id }, // Contemporary - Contemporary
      { classId: createdClasses[5].id, styleId: createdDanceStyles[4].id }  // Jazz Funk - Jazz
    ]

    for (const assignment of classStyleAssignments) {
      await prisma.classStyle.create({
        data: assignment
      })
    }

    console.log(`✅ Created ${classStyleAssignments.length} class-style assignments`)

    // ================== CREATE EVENTS ==================
    console.log('🎉 Creating events...')
    
    const eventStartDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
    const eventEndDate = new Date(eventStartDate.getTime() + 4 * 60 * 60 * 1000) // 4 hours later

    const events = [
      {
        title: 'Annual Dance Showcase',
        description: 'Join us for our annual dance showcase featuring performances from all our classes and levels. A celebration of dance and community!',
        eventType: 'Showcase',
        startDate: eventStartDate,
        endDate: eventEndDate,
        startTime: '19:00',
        endTime: '23:00',
        venueId: venues[0].id,
        price: 15.00,
        maxAttendees: 200,
        currentAttendees: 0,
        imageUrl: '/images/events/annual-showcase.jpg',
        organizerUserId: admin.id,
        status: 'PUBLISHED',
        isFeatured: true
      },
      {
        title: 'Salsa Social Night',
        description: 'Practice your salsa skills in a fun, social environment. All levels welcome! Light refreshments provided.',
        eventType: 'Social Dance',
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        startTime: '20:00',
        endTime: '23:00',
        venueId: venues[1].id,
        price: 10.00,
        maxAttendees: 50,
        currentAttendees: 0,
        imageUrl: '/images/events/salsa-social.jpg',
        organizerUserId: instructor2.id,
        status: 'PUBLISHED',
        isFeatured: true
      },
      {
        title: 'Hip Hop Battle Workshop',
        description: 'Learn battle techniques and freestyle skills from professional dancers. Includes mini battle competition!',
        eventType: 'Workshop',
        startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        startTime: '14:00',
        endTime: '16:00',
        venueId: venues[2].id,
        price: 25.00,
        maxAttendees: 30,
        currentAttendees: 0,
        imageUrl: '/images/events/hip-hop-battle.jpg',
        organizerUserId: instructor3.id,
        status: 'PUBLISHED',
        isFeatured: false
      }
    ]

    const createdEvents = []
    for (const eventData of events) {
      const event = await prisma.event.create({
        data: eventData
      })
      createdEvents.push(event)
    }

    console.log(`✅ Created ${createdEvents.length} events`)

    // ================== CREATE BOOKINGS ==================
    console.log('📝 Creating sample bookings...')
    
    const bookings = [
      {
        userId: students[0].id,
        classId: createdClasses[0].id,
        status: 'CONFIRMED',
        amountPaid: 35.00,
        totalAmount: 35.00,
        paymentStatus: 'completed',
        confirmationCode: 'CONF001'
      },
      {
        userId: students[1].id,
        classId: createdClasses[0].id,
        status: 'CONFIRMED',
        amountPaid: 35.00,
        totalAmount: 35.00,
        paymentStatus: 'completed',
        confirmationCode: 'CONF002'
      },
      {
        userId: students[2].id,
        classId: createdClasses[2].id,
        status: 'CONFIRMED',
        amountPaid: 25.00,
        totalAmount: 25.00,
        paymentStatus: 'completed',
        confirmationCode: 'CONF003'
      },
      {
        userId: students[0].id,
        classId: createdClasses[3].id,
        status: 'PENDING',
        amountPaid: 0.00,
        totalAmount: 30.00,
        paymentStatus: 'pending',
        confirmationCode: 'CONF004'
      },
      {
        userId: students[3].id,
        eventId: createdEvents[0].id,
        status: 'CONFIRMED',
        amountPaid: 15.00,
        totalAmount: 15.00,
        paymentStatus: 'completed',
        confirmationCode: 'CONF005'
      }
    ]

    for (const booking of bookings) {
      await prisma.booking.create({
        data: booking
      })
    }

    console.log(`✅ Created ${bookings.length} bookings`)

    // ================== CREATE TESTIMONIALS ==================
    console.log('⭐ Creating testimonials...')
    
    const testimonials = [
      {
        userId: students[0].id,
        rating: 5,
        message: "The ballet classes here are exceptional! Sarah is an amazing instructor who really helped me improve my technique.",
        isFeatured: true
      },
      {
        userId: students[1].id,
        rating: 5,
        message: "I love the salsa classes! Maria makes learning so fun and the atmosphere is welcoming for beginners.",
        isFeatured: true
      },
      {
        userId: students[2].id,
        rating: 4,
        message: "Great hip hop classes! Jason's energy is contagious and I've learned so many cool moves.",
        isFeatured: true
      },
      {
        userId: students[3].id,
        rating: 5,
        message: "The contemporary classes have helped me express myself in ways I never thought possible. Highly recommended!",
        isFeatured: false
      }
    ]

    for (const testimonial of testimonials) {
      await prisma.testimonial.create({
        data: testimonial
      })
    }

    console.log(`✅ Created ${testimonials.length} testimonials`)

    // ================== CREATE USER STYLES ==================
    console.log('💫 Creating user style preferences...')
    
    const userStyles = [
      { userId: students[0].id, styleId: createdDanceStyles[0].id, proficiency: 'BEGINNER' }, // John - Ballet
      { userId: students[0].id, styleId: createdDanceStyles[2].id, proficiency: 'INTERMEDIATE' }, // John - Hip Hop
      { userId: students[1].id, styleId: createdDanceStyles[1].id, proficiency: 'BEGINNER' }, // Emma - Salsa
      { userId: students[2].id, styleId: createdDanceStyles[2].id, proficiency: 'INTERMEDIATE' }, // Michael - Hip Hop
      { userId: students[3].id, styleId: createdDanceStyles[3].id, proficiency: 'ADVANCED' }, // Sophia - Contemporary
    ]

    for (const userStyle of userStyles) {
      await prisma.userStyle.create({
        data: userStyle
      })
    }

    console.log(`✅ Created ${userStyles.length} user style preferences`)

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📝 Login Credentials:')
    console.log('='.repeat(50))
    console.log('🔑 Admin:')
    console.log('   Email: admin@danceplatform.com')
    console.log('   Password: admin123')
    console.log('\n👨‍🏫 Instructors:')
    console.log('   Sarah Johnson: sarah.johnson@danceplatform.com / instructor123')
    console.log('   Maria Rodriguez: maria.rodriguez@danceplatform.com / instructor123')
    console.log('   Jason Lee: jason.lee@danceplatform.com / instructor123')
    console.log('\n👥 Students:')
    console.log('   John Smith: john.smith@email.com / student123')
    console.log('   Emma Wilson: emma.wilson@email.com / student123')
    console.log('   (+ 4 more students with same password)')
    console.log('\n📊 Summary:')
    console.log('='.repeat(50))
    console.log(`   Users: ${1 + 3 + students.length} (1 admin, 3 instructors, ${students.length} students)`)
    console.log(`   Dance Styles: ${createdDanceStyles.length}`)
    console.log(`   Venues: ${venues.length}`)
    console.log(`   Classes: ${createdClasses.length}`)
    console.log(`   Events: ${createdEvents.length}`)
    console.log(`   Bookings: ${bookings.length}`)
    console.log(`   Testimonials: ${testimonials.length}`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })