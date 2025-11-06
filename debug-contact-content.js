const { PrismaClient } = require('@prisma/client');

async function debugContactContent() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== Debugging Contact Page Content ===');
    
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');
    
    // Check if ContactPageContent model exists and has data
    console.log('Querying for contact page content with id="contact"...');
    const rec = await prisma.contactPageContent.findUnique({ where: { id: 'contact' } });
    console.log('ContactPageContent record:', rec);
    
    if (rec) {
      console.log('✓ Found ContactPageContent record');
    } else {
      console.log('✗ No ContactPageContent record found with id="contact"');
    }
    
    // Check if there are any contact records at all
    console.log('Checking for any ContactPageContent records...');
    const allRecords = await prisma.contactPageContent.findMany();
    console.log('All ContactPageContent records:', allRecords);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Error details:', error);
    await prisma.$disconnect();
  }
}

debugContactContent();