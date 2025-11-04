// Seed demo homepage content into the Railway DB via Prisma
// Uses DATABASE_URL from your environment (.env/.env.local)
const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  const HOMEPAGE_ID = 'homepage'
  const demo = {
    heroTitle: 'Discover Your Rhythm',
    heroSubtitle: 'Join thousands of dancers learning, connecting, and growing every day',
    heroButtonText: 'Explore Classes',
    heroBackgroundImage: '/images/hero-demo.jpg',
    aboutTitle: 'Why Choose DanceLink?',
    aboutDescription: 'Expert instructors, welcoming community, and classes for all levels.',
    testimonialsEnabled: true,
    newsletterEnabled: true,
  }

  try {
    const saved = await prisma.homepageContent.upsert({
      where: { id: HOMEPAGE_ID },
      update: demo,
      create: { id: HOMEPAGE_ID, ...demo },
    })
    console.log('Seeded homepage content:', {
      id: saved.id,
      heroTitle: saved.heroTitle,
      heroSubtitle: saved.heroSubtitle,
      heroBackgroundImage: saved.heroBackgroundImage,
      updatedAt: saved.updatedAt,
    })
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
