const { PrismaClient } = require('@prisma/client')
const fs = require('fs').promises
const path = require('path')

const prisma = new PrismaClient()

async function populateContentData() {
  try {
    console.log('🌱 Populating content data...')
    
    // Read data files
    const dataDir = path.join(__dirname, '..', 'data')
    
    // Load homepage content
    const homepageData = JSON.parse(await fs.readFile(path.join(dataDir, 'homepage-content.json'), 'utf8'))
    
    // Load events content
    const eventsData = JSON.parse(await fs.readFile(path.join(dataDir, 'events-content.json'), 'utf8'))
    
    // Load about content
    const aboutData = JSON.parse(await fs.readFile(path.join(dataDir, 'about-content.json'), 'utf8'))
    
    console.log('📄 Updating homepage content...')
    
    // Update homepage content
    const homepageContent = await prisma.homepageContent.upsert({
      where: { id: 'default' },
      update: {
        heroTitle: homepageData.heroTitle,
        heroSubtitle: homepageData.heroSubtitle,
        heroButtonText: homepageData.heroButtonText,
        heroBackgroundImage: homepageData.heroBackgroundImage,
        aboutTitle: homepageData.aboutTitle,
        aboutDescription: homepageData.aboutDescription,
        testimonialsEnabled: homepageData.testimonialsEnabled,
        newsletterEnabled: homepageData.newsletterEnabled,
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        heroTitle: homepageData.heroTitle,
        heroSubtitle: homepageData.heroSubtitle,
        heroButtonText: homepageData.heroButtonText,
        heroBackgroundImage: homepageData.heroBackgroundImage,
        aboutTitle: homepageData.aboutTitle,
        aboutDescription: homepageData.aboutDescription,
        testimonialsEnabled: homepageData.testimonialsEnabled,
        newsletterEnabled: homepageData.newsletterEnabled,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Homepage content updated: ${homepageContent.id}`)
    
    console.log('📅 Updating events page content...')
    
    // Update events page content
    const eventsContent = await prisma.eventsPageContent.upsert({
      where: { id: 'default' },
      update: {
        heroBadgeText: eventsData.heroBadgeText,
        heroTitle: eventsData.heroTitle,
        heroSubtitle: eventsData.heroSubtitle,
        featuredTitle: eventsData.featuredTitle,
        featuredDescription: eventsData.featuredDescription,
        searchTitle: eventsData.searchTitle,
        searchDescription: eventsData.searchDescription,
        ctaBadgeText: eventsData.ctaBadgeText,
        ctaTitle: eventsData.ctaTitle,
        ctaDescription: eventsData.ctaDescription,
        heroFeatures: eventsData.heroFeatures,
        ctaButtons: eventsData.ctaButtons,
        ctaFeatures: eventsData.ctaFeatures,
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        heroBadgeText: eventsData.heroBadgeText,
        heroTitle: eventsData.heroTitle,
        heroSubtitle: eventsData.heroSubtitle,
        featuredTitle: eventsData.featuredTitle,
        featuredDescription: eventsData.featuredDescription,
        searchTitle: eventsData.searchTitle,
        searchDescription: eventsData.searchDescription,
        ctaBadgeText: eventsData.ctaBadgeText,
        ctaTitle: eventsData.ctaTitle,
        ctaDescription: eventsData.ctaDescription,
        heroFeatures: eventsData.heroFeatures,
        ctaButtons: eventsData.ctaButtons,
        ctaFeatures: eventsData.ctaFeatures,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Events content updated: ${eventsContent.id}`)
    
    console.log('📖 Updating about page content...')
    
    // Update about page content
    const aboutContent = await prisma.aboutPageContent.upsert({
      where: { id: 'default' },
      update: {
        heroTitle: aboutData.heroTitle,
        heroSubtitle: aboutData.heroSubtitle,
        heroBadgeText: aboutData.heroBadgeText,
        statsTitle: aboutData.statsTitle,
        statsDescription: aboutData.statsDescription,
        storyTitle: aboutData.storyTitle,
        storyDescription1: aboutData.storyDescription1,
        storyDescription2: aboutData.storyDescription2,
        whyChooseUsTitle: aboutData.whyChooseUsTitle,
        heroFeatures: aboutData.heroFeatures,
        stats: aboutData.stats,
        features: aboutData.features,
        newsletterTitle: aboutData.newsletterTitle,
        newsletterDescription: aboutData.newsletterDescription,
        newsletterBenefits: aboutData.newsletterBenefits,
        ctaTitle: aboutData.ctaTitle,
        ctaDescription: aboutData.ctaDescription,
        ctaBadgeText: aboutData.ctaBadgeText,
        ctaButtons: aboutData.ctaButtons,
        ctaFeatures: aboutData.ctaFeatures,
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        heroTitle: aboutData.heroTitle,
        heroSubtitle: aboutData.heroSubtitle,
        heroBadgeText: aboutData.heroBadgeText,
        statsTitle: aboutData.statsTitle,
        statsDescription: aboutData.statsDescription,
        storyTitle: aboutData.storyTitle,
        storyDescription1: aboutData.storyDescription1,
        storyDescription2: aboutData.storyDescription2,
        whyChooseUsTitle: aboutData.whyChooseUsTitle,
        heroFeatures: aboutData.heroFeatures,
        stats: aboutData.stats,
        features: aboutData.features,
        newsletterTitle: aboutData.newsletterTitle,
        newsletterDescription: aboutData.newsletterDescription,
        newsletterBenefits: aboutData.newsletterBenefits,
        ctaTitle: aboutData.ctaTitle,
        ctaDescription: aboutData.ctaDescription,
        ctaBadgeText: aboutData.ctaBadgeText,
        ctaButtons: aboutData.ctaButtons,
        ctaFeatures: aboutData.ctaFeatures,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ About content updated: ${aboutContent.id}`)
    
    console.log('\n🎉 Content population complete!')
    console.log('📝 Admins can now edit all content through the admin panel.')
    
  } catch (error) {
    console.error('❌ Error populating content data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateContentData()