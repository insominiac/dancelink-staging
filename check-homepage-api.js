const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkHomepageData() {
  try {
    console.log('=== Checking Homepage Database Values ===\n');
    
    // Check HomepageContent table
    const homepageContent = await prisma.homepageContent.findUnique({ 
      where: { id: 'homepage' } 
    });
    
    console.log('1. HomepageContent table (id="homepage"):');
    if (homepageContent) {
      console.log(JSON.stringify(homepageContent, null, 2));
    } else {
      console.log('  NOT FOUND - No record with id="homepage"');
    }
    
    console.log('\n2. SiteSettings fallback (footer.homepage):');
    const siteSettings = await prisma.siteSettings.findFirst({ 
      orderBy: { createdAt: 'desc' } 
    });
    
    if (siteSettings?.footer?.homepage) {
      console.log(JSON.stringify(siteSettings.footer.homepage, null, 2));
    } else {
      console.log('  NOT FOUND - No SiteSettings or no footer.homepage field');
    }
    
    console.log('\n3. API Response (what GET /api/public/content/homepage returns):');
    console.log('  Based on the route logic:');
    if (homepageContent) {
      console.log('  ✓ Will return HomepageContent table data');
    } else if (siteSettings?.footer?.homepage) {
      console.log('  ✓ Will return SiteSettings.footer.homepage');
    } else {
      console.log('  ✓ Will return DEFAULT_CONTENT (hardcoded fallback)');
    }
    
    console.log('\n=== Summary ===');
    console.log(`HomepageContent exists: ${!!homepageContent}`);
    console.log(`SiteSettings fallback exists: ${!!(siteSettings?.footer?.homepage)}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkHomepageData();
