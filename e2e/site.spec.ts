import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/privacy/', '/terms/']) {
  test(`${path} has one main heading and no serious accessibility violations`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('the landing site remains private, updates its worker, and serves its cached shell offline', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const requestOrigins = new Set<string>();
  page.on('request', (request) => requestOrigins.add(new URL(request.url()).origin));

  try {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller));
    await page.evaluate(async () => (await navigator.serviceWorker.ready).update());
    expect([...requestOrigins]).toEqual(['http://localhost:4173']);

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Your reading settings, from page to page.' })).toBeVisible();
  } finally {
    await context.close();
  }
});

test('the landing page is usable at 390px and links the packaged extension', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Your reading settings, from page to page.' })).toBeVisible();
  await expect(page.locator('img[alt]')).toBeVisible();
  const promises = page.getByRole('region', { name: 'Product promises' });
  await promises.focus();
  await expect(promises).toBeFocused();
  const beforeScroll = await promises.evaluate((element) => element.scrollLeft);
  await promises.press('ArrowRight');
  await expect.poll(() => promises.evaluate((element) => element.scrollLeft)).toBeGreaterThan(beforeScroll);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  const response = await page.request.get('/downloads/reader-setting-transfer-chrome.zip');
  expect(response.ok()).toBe(true);
  await page.screenshot({ path: 'test-results/mobile-landing.png', fullPage: true });
});
