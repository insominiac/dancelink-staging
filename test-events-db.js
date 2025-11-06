const { PrismaClient } = require('@prisma/client');

async function testEventsDb() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== Testing Events Database Query ===');
    
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');
    
    // Check if EventsPageContent model exists and has data
    console.log('Querying for events page content with id="events"...');
    const rec = await prisma.eventsPageContent.findUnique({ where: { id: 'events' } });
    console.log('Query result:', rec);
    
    if (!rec) {
      console.log('No record found, would return DEFAULT_CONTENT');
    } else {
      console.log('Found record, would return specific content');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Error details:', error);
    await prisma.$disconnect();
  }
}

testEventsDb();