import { chromium, expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
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

test('the built extension saves a profile and renders an article', async ({}, testInfo) => {
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(testInfo.outputPath('profile'), {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
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
    const optionsAxe = await new AxeBuilder({ page }).analyze();
    expect(optionsAxe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);

    await page.evaluate(() => chrome.storage.local.set({ currentArticle: {
      title: 'A calmer way to read', byline: 'Ada Reader', source: 'example.test', url: 'http://127.0.0.1:4173/',
      html: '<p>A saved article paragraph with enough words to demonstrate the local reading view.</p><h2>A useful heading</h2><p>Semantic article content remains easy to navigate.</p>',
      excerpt: 'A saved article paragraph', extractedAt: Date.now()
    }}));
    await page.goto(`chrome-extension://${extensionId}/reader.html`);
    await expect(page.getByRole('heading', { level: 1, name: 'A calmer way to read' })).toBeVisible();
    await expect(page.locator('#size-value')).toHaveText('140%');
    await page.getByRole('button', { name: 'Make text larger' }).click();
    await expect(page.locator('#size-value')).toHaveText('145%');
    const readerAxe = await new AxeBuilder({ page }).analyze();
    expect(readerAxe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await context.close();
  }
});
