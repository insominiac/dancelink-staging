const puppeteer = require('puppeteer');

async function testFooterTranslations() {
  console.log('🧪 Testing Footer Translations...\n');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Test different languages
  const languages = ['en', 'es', 'fr', 'de'];
  
  for (const lang of languages) {
    try {
      console.log(`🌍 Testing ${lang.toUpperCase()} translations...`);
      
      // Set Accept-Language header
      await page.setExtraHTTPHeaders({
        'Accept-Language': lang
      });
      
      // Navigate to home page
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Wait for page to load
      await page.waitForSelector('footer', { timeout: 10000 });
      
      // Extract footer content
      const footerContent = await page.evaluate(() => {
        const footer = document.querySelector('footer');
        return footer ? footer.textContent : 'No footer found';
      });
      
      // Look for translation evidence
      const hasTranslationComponents = await page.evaluate(() => {
        const translatedElements = document.querySelectorAll('[data-translated-text]');
        return translatedElements.length > 0;
      });
      
      console.log(`  ✓ Footer loaded: ${footerContent.length > 0 ? 'Yes' : 'No'}`);
      console.log(`  ✓ Translation components: ${hasTranslationComponents ? 'Found' : 'None'}`);
      
      // Check for specific footer sections
      const footerSections = await page.evaluate(() => {
        const sections = [];
        const footer = document.querySelector('footer');
        if (!footer) return sections;
        
        const text = footer.textContent;
        if (text.includes('Newsletter') || text.includes('Boletín')) sections.push('Newsletter');
        if (text.includes('Quick Links') || text.includes('Enlaces')) sections.push('Quick Links');
        if (text.includes('Contact') || text.includes('Contacto')) sections.push('Contact');
        if (text.includes('Social') || text.includes('Redes')) sections.push('Social');
        
        return sections;
      });
      
      console.log(`  ✓ Footer sections: ${footerSections.join(', ') || 'None found'}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error testing ${lang}: ${error.message}`);
      console.log('');
    }
  }
  
  await browser.close();
  console.log('✅ Footer translation test completed!');
}

// Check if dev server is running
const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch {
    return false;
  }
};

async function main() {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Dev server not running on localhost:3000');
    console.log('Please run: npm run dev');
    process.exit(1);
  }
  
  await testFooterTranslations();
}

main().catch(console.error);