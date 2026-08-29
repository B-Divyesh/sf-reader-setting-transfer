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

test('a fresh reader has a usable empty state and keeps article controls inert', async ({}, testInfo) => {
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(testInfo.outputPath('empty-reader-profile'), {
    channel: 'chromium',
    headless: true,
    viewport: { width: 390, height: 844 },
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });

  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const optionsPage = await getOptionsPage(context, extensionId);
    await optionsPage.evaluate(() => chrome.storage.local.clear());

    const page = await context.newPage();
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(`chrome-extension://${extensionId}/reader.html`);

    await expect(page.getByRole('heading', { name: 'Open an article, then choose the extension.' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('#reader-shell')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Make text larger' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Return to original' })).toHaveCount(0);
    await page.locator('.skip-link').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
    // Dispatch directly against the hidden DOM node to prove the defensive
    // initialization also prevents the verifier's former fontScale error.
    await page.locator('#size-up').dispatchEvent('click');
    await expect(page.locator('#reader-status')).toHaveText('Reading card updated.');
    expect(pageErrors).toEqual([]);

    await page.getByRole('button', { name: 'Review my reading card' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('#size-down')).not.toBeFocused();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);

    const errorPage = await context.newPage();
    const initializationErrors: string[] = [];
    errorPage.on('pageerror', (error) => initializationErrors.push(error.message));
    await errorPage.addInitScript(() => {
      Object.defineProperty(chrome.storage.local, 'get', {
        configurable: true,
        value: () => Promise.reject(new Error('Synthetic storage read failure'))
      });
    });
    await errorPage.goto(`chrome-extension://${extensionId}/reader.html`);
    await expect(errorPage.getByText('The saved article could not be opened. Return to its page and collect it again.')).toBeVisible();
    await expect(errorPage.getByRole('heading', { level: 1, name: 'Open an article, then choose the extension.' })).toHaveCount(1);
    await expect(errorPage.locator('#reader-shell')).toBeHidden();
    await expect(errorPage.getByRole('button', { name: 'Make text larger' })).toHaveCount(0);
    await expect(errorPage.getByRole('button', { name: 'Return to original' })).toHaveCount(0);
    expect(initializationErrors).toEqual([]);
  } finally {
    await context.close();
  }
});

test('@claim:extension-local-reader the built extension stores a profile locally and renders a clean article', async ({}, testInfo) => {
  // This claim deliberately runs 12 complete axe scans across the options and
  // reader contrast/size matrix in a real MV3 browser context. On a contended
  // two-worker run that valid workload can exceed the suite's 30 s default,
  // so keep the full regression matrix and give this test bounded headroom.
  test.setTimeout(60_000);
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
    await expect(page.locator('h1:visible')).toHaveCount(1);
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

test('@claim:extension-uninstall-data removing the extension clears its browser-managed local data', async ({}, testInfo) => {
  const extensionPath = resolve('.output/chrome-mv3');
  const profilePath = testInfo.outputPath('uninstall-profile');
  const launch = () => chromium.launchPersistentContext(profilePath, {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });

  let context = await launch();
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const page = await getOptionsPage(context, extensionId);
    await page.evaluate(() => chrome.storage.local.set({ uninstallSentinel: 'private reading data' }));
    await expect.poll(() => page.evaluate(async () => (await chrome.storage.local.get('uninstallSentinel')).uninstallSentinel)).toBe('private reading data');

    // Chromium closes the extension page while this promise is pending. The
    // destroyed execution context is expected and confirms removal completed.
    await page.evaluate(() => chrome.management.uninstallSelf({ showConfirmDialog: false })).catch(() => undefined);
    await expect.poll(() => context.serviceWorkers().length).toBe(0);
  } finally {
    await context.close();
  }

  context = await launch();
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const page = await getOptionsPage(context, extensionId);
    expect(await page.evaluate(() => chrome.storage.local.get(null))).toEqual({});
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
