import { chromium, expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

async function getOptionsPage(context: Awaited<ReturnType<typeof chromium.launchPersistentContext>>, extensionId: string) {
  const url = `chrome-extension://${extensionId}/options.html`;
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    const installedPage = context.pages().find((candidate) => candidate.url() === url);
    if (installedPage) return installedPage;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // The extension intentionally opens this page on first installation. Wait for
  // it to finish before creating our own tab so the two navigations cannot race.
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  return page;
}

test('@claim:extension-local-reader the built extension stores a profile locally and renders a clean article', async ({}, testInfo) => {
  const extensionPath = resolve('.output/chrome-mv3');
  const manifest = JSON.parse(readFileSync(resolve(extensionPath, 'manifest.json'), 'utf8'));
  expect(manifest.permissions).toEqual(['storage', 'activeTab', 'scripting']);
  expect(manifest.host_permissions).toBeUndefined();
  const context = await chromium.launchPersistentContext(testInfo.outputPath('profile'), {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  const requestedUrls: string[] = [];
  context.on('request', (request) => requestedUrls.push(request.url()));
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const page = await getOptionsPage(context, extensionId);
    const consoleErrors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await expect(page.getByRole('heading', { name: /Make a reading card/ })).toBeVisible();
    await page.locator('#font-scale').fill('1.4');
    await expect(page.locator('#font-scale-value')).toHaveText('140%');
    await page.getByRole('button', { name: 'Save reading card' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Saved on this device.' })).toBeVisible();
    for (const contrast of ['paper', 'high', 'dark']) {
      await page.locator('#contrast').selectOption(contrast);
      await expect(page.locator('#preview')).toHaveAttribute('data-contrast', contrast);
      const optionsAxe = await new AxeBuilder({ page }).analyze();
      expect(optionsAxe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')), `options contrast: ${contrast}`).toEqual([]);
    }
    const storedProfile = await page.evaluate(async () => (await chrome.storage.local.get('readerProfile')).readerProfile);
    expect(storedProfile).toMatchObject({ fontScale: 1.4 });

    await page.evaluate(() => chrome.storage.local.set({ currentArticle: {
      title: 'A calmer way to read', byline: 'Ada Reader', source: 'example.test', url: 'http://127.0.0.1:4173/',
      html: '<p>A saved article paragraph with enough words to demonstrate the local reading view.</p><h2>A useful heading</h2><p>Semantic article content remains easy to navigate.</p>',
      excerpt: 'A saved article paragraph', extractedAt: Date.now()
    }}));
    await page.goto(`chrome-extension://${extensionId}/reader.html`);
    await expect(page.getByRole('heading', { level: 1, name: 'A calmer way to read' })).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 2, name: 'A useful heading' })).toBeVisible();
    await expect(page.locator('#size-value')).toHaveText('140%');
    for (const fontScale of [.85, 1, 1.8]) {
      await page.evaluate(async (scale) => {
        const { readerProfile } = await chrome.storage.local.get('readerProfile');
        await chrome.storage.local.set({ readerProfile: { ...readerProfile, fontScale: scale } });
      }, fontScale);
      await page.reload();
      await expect(page.locator('#size-value')).toHaveText(`${Math.round(fontScale * 100)}%`);
      for (const contrast of ['paper', 'high', 'dark']) {
        await page.locator('#reader-contrast').selectOption(contrast);
        await expect(page.locator('#article')).toHaveAttribute('data-contrast', contrast);
        const readerAxe = await new AxeBuilder({ page }).analyze();
        expect(readerAxe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')), `reader ${fontScale} contrast: ${contrast}`).toEqual([]);
      }
    }
    expect(requestedUrls.filter((url) => /^https?:/.test(url))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await context.close();
  }
});

test('@claim:per-site-off-return turns the reader off for one site and returns to the original article', async ({}, testInfo) => {
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(testInfo.outputPath('per-site-profile'), {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const page = await getOptionsPage(context, extensionId);
    await page.evaluate(() => chrome.storage.local.set({ currentArticle: {
      title: 'Return test', byline: '', source: 'example.test', url: 'http://127.0.0.1:4173/',
      html: '<p>A local test article.</p>', excerpt: 'A local test article.', extractedAt: Date.now()
    }}));
    await page.goto(`chrome-extension://${extensionId}/reader.html`);
    await Promise.all([
      page.waitForURL('http://127.0.0.1:4173/'),
      page.getByRole('button', { name: 'Turn off for this site' }).click()
    ]);
    const overrides = await worker.evaluate(async () => (await chrome.storage.local.get('siteOverrides')).siteOverrides);
    expect(overrides).toEqual({ '127.0.0.1': { enabled: false } });
  } finally {
    await context.close();
  }
});

test('the extension settings fit at 390px and explain malformed card files', async ({}, testInfo) => {
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(testInfo.outputPath('mobile-options-profile'), {
    channel: 'chromium',
    headless: true,
    viewport: { width: 390, height: 844 },
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const page = await getOptionsPage(context, new URL(worker.url()).host);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    const brandBox = await page.locator('.brand').boundingBox();
    expect(brandBox?.height).toBeGreaterThanOrEqual(44);
    await page.locator('#import-file').setInputFiles({
      name: 'broken-card.json', mimeType: 'application/json', buffer: Buffer.from('{not JSON')
    });
    await expect(page.locator('#import-status')).toHaveText('This file is not valid JSON. Check the file, then try again.');
  } finally {
    await context.close();
  }
});
