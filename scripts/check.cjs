// check.cjs: opens the game in a hidden browser, waits, and prints every console error.
// Usage: npm run check            (the dev server must be running: npm run dev)
//        node scripts/check.cjs http://localhost:5173
// Exit code 0 = no errors, 1 = errors found. Saves a screenshot to check.png.
const { chromium } = require('playwright');

const url = process.argv[2] || 'http://localhost:5173';
const waitMs = Number(process.argv[3] || 3000);

(async () => {
  const errors = [];
  let browser;
  try {
    browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE ERROR: ' + m.text()); });
    page.on('requestfailed', (r) => errors.push('REQUEST FAILED: ' + r.url()));
    await page.goto(url, { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(waitMs);
    const overlay = await page.evaluate(() => {
      const el = document.getElementById('errors');
      return el && el.style.display !== 'none' ? el.textContent : '';
    });
    if (overlay.trim()) errors.push('ON-SCREEN ERROR BOX:\n' + overlay.trim());
    await page.screenshot({ path: 'check.png' });
  } catch (e) {
    errors.push('CHECK FAILED TO RUN: ' + e.message + '\n(Is "npm run dev" running in another terminal?)');
  } finally {
    if (browser) await browser.close();
  }
  if (errors.length) {
    console.log('ERRORS FOUND (' + errors.length + '):\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('OK: no console errors after ' + waitMs + ' ms. Screenshot saved to check.png');
})();
