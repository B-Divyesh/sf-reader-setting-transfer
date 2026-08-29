import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const base = (process.env.VERIFY_BASE_URL ?? 'https://reader-setting-transfer.sociobot.in').replace(/\/$/, '');
const evidence = process.env.VERIFY_EVIDENCE ?? '.factory/evidence/polish-1';
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const routeTitles = {
  '/': 'Reader Setting Transfer — apply settings to articles',
  '/demo/': 'Demo — Reader Setting Transfer',
  '/privacy/': 'Privacy — Reader Setting Transfer',
  '/terms/': 'Terms — Reader Setting Transfer',
  '/404.html': 'Page not found — Reader Setting Transfer'
};

const browser = await chromium.launch({ channel: 'chromium' });
const results = { base, routes: {}, mobile: {}, privacy: {}, offline: {}, links: {}, errors: [] };

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requestOrigins = new Set();
  page.on('request', (request) => {
    if (request.url().startsWith('http')) requestOrigins.add(new URL(request.url()).origin);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') results.errors.push(message.text());
  });
  page.on('pageerror', (error) => results.errors.push(error.message));

  for (const [path, title] of Object.entries(routeTitles)) {
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    assert(response?.ok(), `${path} did not return 200`);
    assert(await page.title() === title, `${path} title did not match`);
    assert(await page.locator('h1').count() === 1, `${path} did not have one H1`);
    assert(await page.locator('main').count() === 1, `${path} did not have one main`);
    assert(await page.locator('footer a[href="/privacy/"]').count() === 1, `${path} missed Privacy in the footer`);
    assert(await page.locator('footer a[href="/terms/"]').count() === 1, `${path} missed Terms in the footer`);
    const axe = await new AxeBuilder({ page }).analyze();
    const serious = axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));
    assert(serious.length === 0, `${path} had serious Axe findings`);
    results.routes[path] = { title, seriousAxeViolations: serious.length };
  }

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const previewY = (await page.locator('.product-preview').boundingBox())?.y ?? Infinity;
  const howY = (await page.locator('#how-it-works').boundingBox())?.y ?? -1;
  assert(previewY < howY, 'the product preview did not precede How it works');
  await page.evaluate(() => localStorage.setItem('readerProfile', 'live-real-data-sentinel'));
  await page.getByRole('link', { name: /Try it with sample data/ }).click();
  await page.waitForURL(/\/demo\/$/);
  assert(await page.getByText('Demo — sample data, nothing is saved').isVisible(), 'demo banner was not visible');
  const sampleHeading = page.getByRole('heading', { name: 'The city changes when you notice its trees' });
  const headingBox = await sampleHeading.boundingBox();
  const paragraphBox = await page.locator('#demo-article > p').nth(1).boundingBox();
  assert(Boolean(headingBox) && headingBox.y + headingBox.height <= 844, 'sample heading was below the first mobile viewport');
  assert(Boolean(paragraphBox) && paragraphBox.y < 844, 'sample paragraph did not begin in the first mobile viewport');
  await page.screenshot({ path: `${evidence}/live-demo-first-screen.png` });
  await page.locator('#demo-size').fill('1.35');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert(await page.locator('#demo-size-value').textContent() === '120%', 'Reset demo did not restore the sample');
  await page.locator('#demo-size').focus();
  await page.keyboard.press('ArrowRight');
  assert(await page.locator('#demo-size-value').textContent() === '125%', 'demo range did not respond to the keyboard');
  const storage = await page.evaluate(() => ({
    local: Object.fromEntries(Object.entries(localStorage)),
    session: Object.keys(sessionStorage)
  }));
  assert(storage.local.readerProfile === 'live-real-data-sentinel', 'demo touched seeded real data');
  assert(storage.session.length === 1 && storage.session[0] === 'demo:reader-profile', 'demo used an unexpected namespace');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, 'demo overflowed at 390 px');
  results.mobile = { headingBottom: headingBox.y + headingBox.height, paragraphTop: paragraphBox.y, overflow, storage };

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/`);
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  assert(await page.locator('h1').evaluate((node) => node === document.activeElement), 'forward route did not focus the H1');
  await page.goBack();
  assert(await page.locator('h1').evaluate((node) => node === document.activeElement), 'Back did not focus the H1');

  const hrefs = await page.locator('a[href]').evaluateAll((links) => [...new Set(links.map((link) => link.href))]);
  for (const href of hrefs) {
    if (!href.startsWith('http')) continue;
    const response = await context.request.get(href);
    assert(response.status() < 400, `link failed: ${href} (${response.status()})`);
  }
  results.links = { checked: hrefs.length };
  const productHost = new URL(base).hostname;
  const productCookies = (await context.cookies()).filter((cookie) => cookie.domain.replace(/^\./, '') === productHost);
  results.privacy = { requestOrigins: [...requestOrigins], cookies: productCookies };
  assert([...requestOrigins].every((origin) => origin === new URL(base).origin), 'a page contacted another origin');
  assert(productCookies.length === 0, 'the site set a cookie');
  assert(results.errors.length === 0, 'the browser reported console or page errors');
  await context.close();

  const unknownContext = await browser.newContext();
  const unknownPage = await unknownContext.newPage();
  const unknownResponse = await unknownPage.goto(`${base}/not-a-real-route`);
  assert(unknownResponse?.status() === 404, 'unknown route did not return HTTP 404');
  assert(await unknownPage.getByRole('heading', { name: 'Page not found.' }).isVisible(), 'unknown route missed the designed 404');
  await unknownContext.close();

  const offlineContext = await browser.newContext();
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${base}/?demo=1`);
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  assert(await offlinePage.getByText('Demo — sample data, nothing is saved').isVisible(), 'demo did not reload offline');
  results.offline = { demoReloaded: true };
  await offlineContext.close();

  const headerResponse = await fetch(`${base}/`);
  const headers = Object.fromEntries(headerResponse.headers);
  for (const name of ['content-security-policy', 'permissions-policy', 'referrer-policy', 'x-content-type-options', 'x-frame-options']) {
    assert(Boolean(headers[name]), `missing response header: ${name}`);
  }
  results.headers = headers;
  await writeFile(`${evidence}/live-browser.json`, `${JSON.stringify(results, null, 2)}\n`);
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
