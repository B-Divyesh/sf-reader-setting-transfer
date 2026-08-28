import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
  test(`${path} has one main heading and no serious accessibility violations`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(/Reader Setting Transfer/);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('@claim:offline-reload the demo reloads after the first visit while offline', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('/demo/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller));
    await page.evaluate(async () => (await navigator.serviceWorker.ready).update());

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Try your settings on a real article.' })).toBeVisible();
    await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('@claim:responsive-keyboard the landing page works at 390px with keyboard scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Carry your reading settings into clean articles.' })).toBeVisible();
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

test('@claim:reading-settings sample settings visibly change and reset the article', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo/');
  const article = page.locator('#demo-article');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('#demo-size-value')).toHaveText('120%');

  await page.locator('#demo-size').fill('1.6');
  await page.locator('#demo-leading').fill('2.1');
  await page.locator('#demo-font').selectOption('dyslexia');
  await page.locator('#demo-contrast').selectOption('dark');
  await page.locator('#demo-motion').uncheck();
  await expect(page.locator('#demo-size-value')).toHaveText('160%');
  await expect(page.locator('#demo-leading-value')).toHaveText('2.10×');
  await expect(article).toHaveAttribute('data-font', 'dyslexia');
  await expect(article).toHaveAttribute('data-contrast', 'dark');
  await expect(article).toHaveAttribute('data-reduce-motion', 'false');

  await page.locator('.skip-link').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#demo-size-value')).toHaveText('120%');
  await expect(article).toHaveAttribute('data-font', 'hyperlegible');
  await expect(article).toHaveAttribute('data-contrast', 'paper');
  await page.locator('#demo-size').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#demo-size-value')).toHaveText('125%');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const undersizedTargets = await page.locator('button, input, select, a').evaluateAll((elements) => elements
    .filter((element) => {
      const target = element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type)
        ? element.closest('label') ?? element
        : element;
      const box = target.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && (box.width < 44 || box.height < 44);
    })
    .map((element) => ({ tag: element.tagName, id: element.id, text: element.textContent?.trim(), box: element.getBoundingClientRect().toJSON() })));
  expect(undersizedTargets).toEqual([]);
  await page.screenshot({ path: 'test-results/mobile-demo.png', fullPage: true });
});

test('@claim:profile-json-transfer the sample card exports and imports as JSON', async ({ page }) => {
  await page.goto('/demo/');
  const imported = {
    version: 1,
    name: 'Boundary recovery',
    fontScale: 1.3,
    measure: 40,
    lineHeight: 1.5,
    paragraphSpace: 2.5,
    letterSpacing: 0.08,
    contrast: 'dark',
    fontChoice: 'dyslexia',
    reduceMotion: false
  };
  await page.locator('#demo-import').setInputFiles({
    name: 'reading-card.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(imported))
  });
  await expect(page.getByRole('status').filter({ hasText: 'Imported “Boundary recovery” into the demo.' })).toBeVisible();
  const article = page.locator('#demo-article');
  await expect(article).toHaveCSS('--demo-measure', '40ch');
  await expect(article).toHaveCSS('--demo-para', '2.5em');
  await expect(article).toHaveCSS('--demo-spacing', '0.08em');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export sample card' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('sample-reading-card.json');
  const body = JSON.parse(await (await download.createReadStream()).toArray().then((chunks) => Buffer.concat(chunks).toString('utf8')));
  expect(body).toEqual(imported);

  await page.locator('#demo-import').setInputFiles({
    name: 'broken-card.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{not JSON')
  });
  await expect(page.locator('#demo-status')).toHaveText('This file is not valid JSON. Check the file, then try again.');
});

test('@claim:demo-isolation the demo uses only its namespace and first-party requests', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  try {
    await page.goto('/demo/');
    await page.locator('#demo-size').fill('1.35');
    const storage = await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage)
    }));
    expect(storage.local).toEqual([]);
    expect(storage.session).toEqual(['demo:reader-profile']);
    expect([...origins]).toEqual(['http://localhost:4173']);
  } finally {
    await context.close();
  }
});

test('unknown routes return the designed 404 response', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This page slipped out of frame.' })).toBeVisible();
});

test('the advertised demo query opens the sandbox route', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('/demo opens the real sample instead of the landing fallback', async ({ page }) => {
  const response = await page.goto('/demo');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Try your settings on a real article.' })).toBeVisible();
});
