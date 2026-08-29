import { chromium, expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { extractArticleFromPage } from '../lib/article';

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
    await expect(page.getByRole('heading', { name: 'Set your reading card.' })).toBeVisible();
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

test('@claim:extension-reading-settings the packaged Chromium extension applies every reading setting', async ({}, testInfo) => {
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(testInfo.outputPath('all-settings-profile'), {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const page = await getOptionsPage(context, extensionId);
    await page.evaluate(() => chrome.storage.local.clear());
    await page.reload();
    await expect(page.locator('#profile-name')).toHaveValue('My reading card');

    await page.locator('#profile-name').fill('Complete settings');
    await page.locator('#font-scale').fill('1.35');
    await page.locator('#measure').fill('48');
    await page.locator('#line-height').fill('1.9');
    await page.locator('#paragraph-space').fill('1.7');
    await page.locator('#letter-spacing').fill('0.04');
    await page.locator('#font-choice').selectOption('dyslexia');
    await page.locator('#contrast').selectOption('dark');
    await page.locator('#reduce-motion').check();
    const preview = page.locator('#preview');
    await expect(preview).toHaveCSS('--preview-size', '27px');
    await expect(preview).toHaveCSS('--preview-measure', '48ch');
    await expect(preview).toHaveCSS('--preview-leading', '1.9');
    await expect(preview).toHaveCSS('--preview-para', '1.7em');
    await expect(preview).toHaveCSS('--preview-spacing', '0.04em');
    await expect(preview).toHaveAttribute('data-font', 'dyslexia');
    await expect(preview).toHaveAttribute('data-contrast', 'dark');
    await page.getByRole('button', { name: 'Save reading card' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Saved on this device.' })).toBeVisible();

    await page.evaluate(() => chrome.storage.local.set({ currentArticle: {
      title: 'Every setting test', byline: '', source: 'example.test', url: 'https://example.test/article',
      html: '<p>Every reading setting should reach this article.</p>', excerpt: 'Every reading setting', extractedAt: Date.now()
    }}));
    await page.goto(`chrome-extension://${extensionId}/reader.html`);
    const article = page.locator('#article');
    await expect(article).toHaveCSS('--article-size', '27px');
    await expect(article).toHaveCSS('--article-measure', '48ch');
    await expect(article).toHaveCSS('--article-leading', '1.9');
    await expect(article).toHaveCSS('--article-para', '1.7em');
    await expect(article).toHaveCSS('--article-spacing', '0.04em');
    await expect(article).toHaveAttribute('data-font', 'dyslexia');
    await expect(article).toHaveAttribute('data-contrast', 'dark');
    await expect(article).toHaveAttribute('data-reduce-motion', 'true');
    await expect(page.locator('#profile-name')).toHaveText('Complete settings');
    expect(await article.evaluate((element) => getComputedStyle(element).animationName)).toBe('none');

    await page.evaluate(async () => {
      const { readerProfile } = await chrome.storage.local.get('readerProfile');
      await chrome.storage.local.set({ readerProfile: { ...readerProfile, reduceMotion: false } });
    });
    await page.reload();
    await expect(article).toHaveAttribute('data-reduce-motion', 'false');
    expect(await article.evaluate((element) => getComputedStyle(element).animationName)).toBe('settle');
  } finally {
    await context.close();
  }
});

test('@claim:extension-reading-card-transfer a complete reading card transfers between clean packaged extension profiles', async ({}, testInfo) => {
  test.setTimeout(60_000);
  const extensionPath = resolve('.output/chrome-mv3');
  const transferred = {
    version: 1,
    name: 'Travel reading',
    fontScale: 1.45,
    measure: 44,
    lineHeight: 1.85,
    paragraphSpace: 1.9,
    letterSpacing: 0.05,
    contrast: 'dark',
    fontChoice: 'dyslexia',
    reduceMotion: false
  };
  const launch = (name: string) => chromium.launchPersistentContext(testInfo.outputPath(name), {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });

  const sourceContext = await launch('card-transfer-source');
  let exported: Buffer;
  try {
    let worker = sourceContext.serviceWorkers()[0];
    if (!worker) worker = await sourceContext.waitForEvent('serviceworker');
    const source = await getOptionsPage(sourceContext, new URL(worker.url()).host);
    await source.evaluate(() => chrome.storage.local.clear());
    await source.reload();
    await source.locator('#profile-name').fill(transferred.name);
    await source.locator('#font-scale').fill(String(transferred.fontScale));
    await source.locator('#measure').fill(String(transferred.measure));
    await source.locator('#line-height').fill(String(transferred.lineHeight));
    await source.locator('#paragraph-space').fill(String(transferred.paragraphSpace));
    await source.locator('#letter-spacing').fill(String(transferred.letterSpacing));
    await source.locator('#contrast').selectOption(transferred.contrast);
    await source.locator('#font-choice').selectOption(transferred.fontChoice);
    await source.locator('#reduce-motion').setChecked(transferred.reduceMotion);
    await source.getByRole('button', { name: 'Save reading card' }).click();
    await expect(source.locator('#save-status')).toHaveText('Saved on this device.');
    const downloadPromise = source.waitForEvent('download');
    await source.getByRole('button', { name: 'Export my card' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('my-reading-card.json');
    exported = Buffer.concat(await (await download.createReadStream()).toArray());
    expect(JSON.parse(exported.toString('utf8'))).toEqual(transferred);
  } finally {
    await sourceContext.close();
  }

  const destinationContext = await launch('card-transfer-destination');
  try {
    let worker = destinationContext.serviceWorkers()[0];
    if (!worker) worker = await destinationContext.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const destination = await getOptionsPage(destinationContext, extensionId);
    await expect(destination.locator('#profile-name')).toHaveValue('My reading card');
    await destination.locator('#import-file').setInputFiles({
      name: 'travel-reading-card.json', mimeType: 'application/json', buffer: exported
    });
    await expect(destination.locator('#import-status')).toHaveText('Imported “Travel reading”.');
    expect(await destination.evaluate(async () => (await chrome.storage.local.get('readerProfile')).readerProfile)).toEqual(transferred);
    await destination.evaluate(() => chrome.storage.local.set({ currentArticle: {
      title: 'Transferred card article', byline: '', source: 'travel.example', url: 'https://travel.example/article',
      html: '<p>This local article confirms every imported setting in the reader.</p>', excerpt: 'This local article', extractedAt: Date.now()
    }}));
    await destination.goto(`chrome-extension://${extensionId}/reader.html`);
    const article = destination.locator('#article');
    await expect(article).toHaveCSS('--article-size', '29px');
    await expect(article).toHaveCSS('--article-measure', '44ch');
    await expect(article).toHaveCSS('--article-leading', '1.85');
    await expect(article).toHaveCSS('--article-para', '1.9em');
    await expect(article).toHaveCSS('--article-spacing', '0.05em');
    await expect(article).toHaveAttribute('data-font', 'dyslexia');
    await expect(article).toHaveAttribute('data-contrast', 'dark');
    await expect(article).toHaveAttribute('data-reduce-motion', 'false');
  } finally {
    await destinationContext.close();
  }
});

test('@claim:extension-open-article a real local public article reaches the packaged reader with its active site and safe links', async ({}, testInfo) => {
  test.setTimeout(60_000);
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(testInfo.outputPath('open-article-profile'), {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const options = await getOptionsPage(context, extensionId);
    await options.evaluate(() => chrome.storage.local.clear());
    await options.locator('#profile-name').fill('Article flow card');
    await options.locator('#font-scale').fill('1.3');
    await options.locator('#contrast').selectOption('dark');
    await options.getByRole('button', { name: 'Save reading card' }).click();
    await expect(options.locator('#save-status')).toHaveText('Saved on this device.');

    const source = await context.newPage();
    await source.goto('http://127.0.0.1:4173/terms/');
    await source.evaluate(() => {
      document.title = 'A local article about street trees';
      document.querySelector('meta[property="og:title"]')?.remove();
      document.body.innerHTML = `<main><article><h1>A local article about street trees</h1><p>${'A public article paragraph about evening walks, street trees, and settings that support careful reading. '.repeat(5)}</p><h2>Useful details</h2><ul><li>Notice the canopy before dusk.</li><li>Record birds near the streetlights.</li></ul><p>Read <a href="/privacy/">the privacy note</a> before sharing a card.</p></article></main>`;
    });
    const sourceBefore = await source.locator('main').innerHTML();
    const extracted = await source.evaluate(extractArticleFromPage);
    expect(extracted.title).toBe('A local article about street trees');
    expect(extracted.html).toContain('<ul>');
    expect(extracted.html).toContain('http://127.0.0.1:4173/privacy/');
    expect(await source.locator('main').innerHTML()).toBe(sourceBefore);

    await options.bringToFront();
    await expect.poll(() => options.isClosed()).toBe(false);
    await options.evaluate(async (article) => chrome.runtime.sendMessage({ type: 'reader-setting-transfer:open-reader', article }), extracted);
    await expect.poll(() => context.pages().find((page) => page.url() === `chrome-extension://${extensionId}/reader.html`)).not.toBeUndefined();
    const reader = context.pages().find((page) => page.url() === `chrome-extension://${extensionId}/reader.html`)!;
    await expect(reader.getByRole('heading', { level: 1, name: 'A local article about street trees' })).toBeVisible();
    await expect(reader.getByRole('heading', { level: 2, name: 'Useful details' })).toBeVisible();
    await expect(reader.getByRole('link', { name: 'the privacy note' })).toHaveAttribute('href', 'http://127.0.0.1:4173/privacy/');
    await expect(reader.getByRole('link', { name: 'the privacy note' })).toHaveAttribute('target', '_blank');
    await expect(reader.locator('#site-rule')).toHaveText('Applied on 127.0.0.1');
    await expect(reader.locator('#profile-name')).toHaveText('Article flow card');
    await expect(reader.locator('#size-value')).toHaveText('130%');
    await expect(reader.locator('#article')).toHaveAttribute('data-contrast', 'dark');
    expect(await worker.evaluate(async () => (await chrome.storage.local.get('currentArticle')).currentArticle)).toMatchObject({
      title: 'A local article about street trees', url: 'http://127.0.0.1:4173/terms/'
    });
  } finally {
    await context.close();
  }
});

test('@claim:extension-no-remote-requests extension use stays inside the installed package', async ({}, testInfo) => {
  const extensionPath = resolve('.output/chrome-mv3');
  const manifest = JSON.parse(readFileSync(resolve(extensionPath, 'manifest.json'), 'utf8'));
  const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
  expect(manifest.host_permissions).toBeUndefined();
  expect(manifest.externally_connectable).toBeUndefined();
  expect(manifest.permissions).not.toContain('cookies');
  expect(Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies }))
    .not.toEqual(expect.arrayContaining(['@segment/analytics-next', 'firebase', 'posthog-js']));

  const context = await chromium.launchPersistentContext(testInfo.outputPath('no-remote-profile'), {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  const remoteRequests: string[] = [];
  context.on('request', (request) => {
    if (/^https?:/.test(request.url())) remoteRequests.push(request.url());
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const page = await getOptionsPage(context, extensionId);
    await page.evaluate(() => chrome.storage.local.clear());
    await page.locator('#font-scale').fill('1.25');
    await page.getByRole('button', { name: 'Save reading card' }).click();
    await page.evaluate(() => chrome.storage.local.set({ currentArticle: {
      title: 'Local request check', byline: '', source: 'local.test', url: 'https://local.test/article',
      html: '<p>Stored article content.</p>', excerpt: 'Stored article content.', extractedAt: Date.now()
    }}));
    await page.goto(`chrome-extension://${extensionId}/reader.html`);
    await expect(page.getByRole('heading', { name: 'Local request check' })).toBeVisible();
    expect(remoteRequests).toEqual([]);
    expect(await context.cookies()).toEqual([]);
    expect(Object.keys(await page.evaluate(() => chrome.storage.local.get(null))).sort()).toEqual(['currentArticle', 'readerProfile']);
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

test('@claim:activation-boundary @claim:no-background-monitoring passive browsing cannot populate extension storage', async ({}, testInfo) => {
  const extensionPath = resolve('.output/chrome-mv3');
  const manifest = JSON.parse(readFileSync(resolve(extensionPath, 'manifest.json'), 'utf8'));
  expect(manifest.content_scripts).toBeUndefined();
  expect(manifest.host_permissions).toBeUndefined();
  expect(manifest.permissions).toEqual(['storage', 'activeTab', 'scripting']);
  expect(manifest.action.default_popup).toBe('popup.html');

  const context = await chromium.launchPersistentContext(testInfo.outputPath('activation-boundary-profile'), {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  const extensionRequests: string[] = [];
  context.on('request', (request) => {
    if (request.url().startsWith('chrome-extension:')) extensionRequests.push(request.url());
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const optionsPage = await getOptionsPage(context, extensionId);
    await optionsPage.evaluate(() => chrome.storage.local.clear());
    await optionsPage.close();
    extensionRequests.length = 0;

    const articlePage = await context.newPage();
    await articlePage.goto('/terms/');
    await articlePage.goto('/');
    const pageBefore = await articlePage.locator('main').innerHTML();
    await articlePage.waitForTimeout(250);
    expect(await worker.evaluate(() => chrome.storage.local.get(null))).toEqual({});
    expect(await articlePage.locator('main').innerHTML()).toBe(pageBefore);
    expect(extensionRequests).toEqual([]);
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
