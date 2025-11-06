const { PrismaClient } = require('@prisma/client');

async function debugEventsApi() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== Debugging Events API ===');
    
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');
    
    // Check if EventsPageContent model exists and has data
    const rec = await prisma.eventsPageContent.findUnique({ where: { id: 'events' } });
    console.log('EventsPageContent record:', rec);
    
    if (rec) {
      console.log('✓ Found EventsPageContent record');
      const response = {
        heroBadgeText: rec.heroBadgeText,
        heroTitle: rec.heroTitle,
        heroSubtitle: rec.heroSubtitle,
        featuredTitle: rec.featuredTitle,
        featuredDescription: rec.featuredDescription,
        searchTitle: rec.searchTitle,
        searchDescription: rec.searchDescription,
        ctaBadgeText: rec.ctaBadgeText,
        ctaTitle: rec.ctaTitle,
        ctaDescription: rec.ctaDescription,
        heroFeatures: rec.heroFeatures,
        ctaButtons: rec.ctaButtons,
        ctaFeatures: rec.ctaFeatures,
      };
      console.log('API Response would be:', JSON.stringify(response, null, 2));
    } else {
      console.log('✗ No EventsPageContent record found with id="events"');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Error details:', error);
    await prisma.$disconnect();
  }
}

debugEventsApi();