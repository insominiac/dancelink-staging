const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function main() {
  try {
    // Check HomepageContent table
    const homepage = await prisma.homepageContent.findUnique({ 
      where: { id: 'homepage' } 
    });
    console.log('HomepageContent table:');
    console.log(JSON.stringify(homepage, null, 2));
    
    // Check SiteSettings as fallback
    const settings = await prisma.siteSettings.findFirst({ 
      orderBy: { createdAt: 'desc' } 
    });
    console.log('\nSiteSettings (latest):');
    console.log(JSON.stringify(settings?.footer, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
