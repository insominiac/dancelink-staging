const { PrismaClient } = require('@prisma/client');

async function debugEventsAll() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== Debugging Events API ===');
    
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');
    
    // Check if EventsPageContent model exists and has any data
    const allRecords = await prisma.eventsPageContent.findMany();
    console.log('All EventsPageContent records:', allRecords);
    
    if (allRecords.length === 0) {
      console.log('✗ No EventsPageContent records found');
    } else {
      console.log(`✓ Found ${allRecords.length} EventsPageContent records`);
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Error details:', error);
    await prisma.$disconnect();
  }
}

debugEventsAll();