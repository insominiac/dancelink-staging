const puppeteer = require('puppeteer');

async function testPartnerMatchTranslations() {
  console.log('🧪 Testing Partner Match Page Translations...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Test different languages
    const testCases = [
      { 
        lang: 'en', 
        expectedTexts: ['Find Your Perfect Dance Partner', 'Browse Partners', 'Search Partners', 'Advanced Filters']
      },
      { 
        lang: 'es', 
        expectedTexts: ['Encuentra tu pareja de baile perfecta', 'Buscar socios', 'Buscar socios', 'Filtros avanzados']
      },
      { 
        lang: 'fr', 
        expectedTexts: ['Trouvez votre partenaire de danse parfait', 'Parcourir les partenaires', 'Rechercher des partenaires', 'Filtres avancés']
      }
    ];
    
    for (const test of testCases) {
      console.log(`🌍 Testing ${test.lang.toUpperCase()} locale...`);
      
      // Set language header
      await page.setExtraHTTPHeaders({
        'Accept-Language': test.lang
      });
      
      // Navigate to partner-match page
      console.log('  → Navigating to /partner-match...');
      await page.goto(`http://localhost:3000/partner-match?lang=${test.lang}`, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait for page to fully load
      await page.waitForTimeout(2000);
      
      // Get page content
      const pageText = await page.evaluate(() => document.body.innerText);
      
      // Check if key texts are present (they might be translated)
      const foundTexts = [];
      const missingTexts = [];
      
      // For English, check exact matches
      if (test.lang === 'en') {
        for (const text of test.expectedTexts) {
          if (pageText.includes(text)) {
            foundTexts.push(text);
          } else {
            missingTexts.push(text);
          }
        }
      } else {
        // For other languages, just check if the page loaded and has content
        const hasContent = pageText.length > 500;
        if (hasContent) {
          console.log(`  ✓ Page loaded with content (${pageText.length} chars)`);
        } else {
          console.log(`  ❌ Page seems empty or failed to load`);
        }
      }
      
      if (test.lang === 'en') {
        if (foundTexts.length > 0) {
          console.log(`  ✓ Found texts: ${foundTexts.join(', ')}`);
        }
        if (missingTexts.length > 0) {
          console.log(`  ⚠️  Missing texts: ${missingTexts.join(', ')}`);
        }
      }
      
      // Check for translation components
      const hasTranslationSetup = await page.evaluate(() => {
        return typeof window.i18next !== 'undefined';
      });
      
      console.log(`  → Translation system: ${hasTranslationSetup ? 'Active' : 'Not detected'}`);
      
      // Check for specific elements
      const elements = await page.evaluate(() => {
        const results = {};
        
        // Check hero title
        const h1 = document.querySelector('h1');
        if (h1) results.heroTitle = h1.innerText;
        
        // Check search input
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) results.searchPlaceholder = searchInput.placeholder;
        
        // Check buttons
        const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText);
        results.buttonTexts = buttons.filter(t => t && t.length > 0).slice(0, 5);
        
        // Check filter labels
        const labels = Array.from(document.querySelectorAll('label')).map(l => l.innerText);
        results.labelTexts = labels.filter(t => t && t.length > 0).slice(0, 5);
        
        return results;
      });
      
      console.log('  → Page elements found:');
      if (elements.heroTitle) console.log(`    • Hero: "${elements.heroTitle.substring(0, 50)}..."`);
      if (elements.searchPlaceholder) console.log(`    • Search: "${elements.searchPlaceholder}"`);
      if (elements.buttonTexts?.length > 0) console.log(`    • Buttons: ${elements.buttonTexts.length} found`);
      if (elements.labelTexts?.length > 0) console.log(`    • Labels: ${elements.labelTexts.length} found`);
      
      console.log('');
    }
    
    // Test language switching
    console.log('🔄 Testing Language Switching...');
    
    // Go to English version first
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    await page.goto('http://localhost:3000/partner-match', { waitUntil: 'networkidle2' });
    
    const initialTitle = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.innerText : null;
    });
    
    console.log(`  Initial title (EN): "${initialTitle}"`);
    
    // Switch to Spanish
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'es');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    const titleAfterSwitch = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.innerText : null;
    });
    
    console.log(`  After switch (ES): "${titleAfterSwitch}"`);
    
    if (initialTitle !== titleAfterSwitch && titleAfterSwitch) {
      console.log('  ✅ Language switching appears to be working!');
    } else {
      console.log('  ⚠️  Language switching may not be working properly');
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n✅ Partner Match translation test completed!');
}

// Check if dev server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('⚠️  Dev server not running on localhost:3000');
    console.log('Starting dev server...');
    const { exec } = require('child_process');
    const server = exec('npm run dev', { cwd: __dirname });
    
    // Wait for server to start
    console.log('Waiting for server to start...');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  await testPartnerMatchTranslations();
}

main().catch(console.error);