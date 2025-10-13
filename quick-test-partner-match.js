const puppeteer = require('puppeteer');

async function testPartnerMatch() {
  console.log('Testing partner-match page translations...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Test English first
    console.log('🇺🇸 Testing English...');
    await page.goto('http://localhost:3000/partner-match', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Check if page has loaded beyond spinner
    const hasContent = await page.evaluate(() => {
      const spinner = document.querySelector('.animate-spin');
      const h1 = document.querySelector('h1');
      return { 
        hasSpinner: !!spinner,
        hasH1: !!h1,
        h1Text: h1 ? h1.innerText : null,
        bodyText: document.body.innerText.substring(0, 500)
      };
    });
    
    console.log('Page status:');
    console.log('  - Has spinner:', hasContent.hasSpinner);
    console.log('  - Has H1:', hasContent.hasH1);
    console.log('  - H1 text:', hasContent.h1Text);
    console.log('  - Body preview:', hasContent.bodyText.substring(0, 200) + '...');
    
    // Test Spanish
    console.log('\n🇪🇸 Testing Spanish...');
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'es');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    const spanishContent = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return {
        h1Text: h1 ? h1.innerText : null,
        hasTranslation: document.body.innerText.includes('Encuentra') || 
                       document.body.innerText.includes('Buscar') ||
                       document.body.innerText.includes('pareja')
      };
    });
    
    console.log('Spanish page:');
    console.log('  - H1 text:', spanishContent.h1Text);
    console.log('  - Has Spanish keywords:', spanishContent.hasTranslation);
    
    // Check if TranslatedText is working
    const translationSystem = await page.evaluate(() => {
      return {
        hasI18n: typeof window.i18next !== 'undefined',
        currentLang: window.i18next ? window.i18next.language : null
      };
    });
    
    console.log('\nTranslation system:');
    console.log('  - i18next loaded:', translationSystem.hasI18n);
    console.log('  - Current language:', translationSystem.currentLang);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

testPartnerMatch().catch(console.error);