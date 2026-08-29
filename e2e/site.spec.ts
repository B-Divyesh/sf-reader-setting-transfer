import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

function contrastRatio(first: number[], second: number[]) {
  const luminance = (rgb: number[]) => rgb
    .map((channel) => channel / 255)
    .map((channel) => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4)
    .reduce((total, channel, index) => total + channel * [.2126, .7152, .0722][index], 0);
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + .05) / (darker + .05);
}

function rgbChannels(value: string) {
  return value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
}

async function tabTo(page: import('@playwright/test').Page, target: import('@playwright/test').Locator) {
  for (let index = 0; index < 30; index += 1) {
    await page.keyboard.press('Tab');
    if (await target.evaluate((element) => document.activeElement === element)) return;
  }
  throw new Error(`Could not reach ${await target.getAttribute('id') ?? await target.textContent()} with Tab`);
}

const routeMetadata = {
  '/': 'Reader Setting Transfer — apply settings to articles',
  '/demo/': 'Demo — Reader Setting Transfer',
  '/privacy/': 'Privacy — Reader Setting Transfer',
  '/terms/': 'Terms — Reader Setting Transfer',
  '/404.html': 'Page not found — Reader Setting Transfer'
} as const;

for (const [path, title] of Object.entries(routeMetadata)) {
  test(`${path} has one main heading and no serious accessibility violations`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /^.{1,155}$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path === '/' ? '/$' : path.replaceAll('/', '\\/')}$`));
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/social-card\.jpg$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/privacy/"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/terms/"]')).toHaveCount(1);
    await expect(page.locator('header .logo')).toHaveCount(1);
    await expect(page.locator('footer .logo')).toHaveCount(1);
    await expect(page.locator('footer a', { hasText: 'Source on GitHub (external)' })).toHaveCount(1);
    await expect(page.locator('footer')).toContainText('Built by Param Factory · Version 1.0');
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
    await expect(page.getByRole('heading', { name: 'Try your settings on a sample article.' })).toBeVisible();
    await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('@claim:offline-landing the landing page reloads after the first visit while offline', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);
    // The first controlled reload lets the worker cache the landing assets it
    // did not see while it was registering.
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller));

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Apply your reading card to web articles.' })).toBeVisible();
    await expect(page.locator('#offline-banner')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('@claim:responsive-keyboard the landing page and demo work at 390px with a keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Apply your reading card to web articles.' })).toBeVisible();
  await expect(page.locator('img[alt]')).toBeVisible();
  const promises = page.getByRole('region', { name: 'Product promises' });
  await tabTo(page, promises);
  await expect(promises).toBeFocused();
  const beforeScroll = await promises.evaluate((element) => element.scrollLeft);
  await promises.press('ArrowRight');
  await expect.poll(() => promises.evaluate((element) => element.scrollLeft)).toBeGreaterThan(beforeScroll);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.screenshot({ path: 'test-results/mobile-landing.png', fullPage: true });

  const primary = page.getByRole('link', { name: 'Try it with sample data' });
  await tabTo(page, primary);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  const sampleHeading = page.getByRole('heading', { name: 'The city changes when you notice its trees' });
  const headingBox = await sampleHeading.boundingBox();
  expect(headingBox).not.toBeNull();
  expect(headingBox!.y + headingBox!.height).toBeLessThanOrEqual(844);
  const firstParagraphBox = await page.locator('#demo-article > p').nth(1).boundingBox();
  expect(firstParagraphBox).not.toBeNull();
  expect(firstParagraphBox!.y).toBeLessThan(844);
  await page.screenshot({ path: 'test-results/mobile-demo-first-screen.png' });
  const reset = page.getByRole('button', { name: 'Reset demo' });
  await tabTo(page, reset);
  await page.keyboard.press('Enter');
  await expect(page.locator('#demo-article')).toBeFocused();

  await tabTo(page, page.locator('#demo-size'));
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#demo-size-value')).toHaveText('125%');
  await tabTo(page, page.locator('#demo-leading'));
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#demo-leading-value')).toHaveText('1.80×');
  await tabTo(page, page.locator('#demo-font'));
  await page.keyboard.press('End');
  await expect(page.locator('#demo-font')).toHaveValue('dyslexia');
  await tabTo(page, page.locator('#demo-contrast'));
  await page.keyboard.press('End');
  await expect(page.locator('#demo-contrast')).toHaveValue('dark');
  await tabTo(page, page.locator('#demo-motion'));
  await page.keyboard.press('Space');
  await expect(page.locator('#demo-motion')).not.toBeChecked();

  const downloadPromise = page.waitForEvent('download');
  await tabTo(page, page.getByRole('button', { name: 'Export sample card' }));
  await page.keyboard.press('Enter');
  expect((await downloadPromise).suggestedFilename()).toBe('sample-reading-card.json');

  const importInput = page.locator('#demo-import');
  await tabTo(page, importInput);
  const chooserPromise = page.waitForEvent('filechooser');
  await page.keyboard.press('Enter');
  const chooser = await chooserPromise;
  await chooser.setFiles({
    name: 'keyboard-reading-card.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      version: 1, name: 'Keyboard card', fontScale: 1.1, measure: 55,
      lineHeight: 1.6, paragraphSpace: 1.4, letterSpacing: .03,
      contrast: 'high', fontChoice: 'serif', reduceMotion: true
    }))
  });
  await expect(page.locator('#demo-status')).toHaveText('Imported “Keyboard card” into the demo.');

  await tabTo(page, reset);
  await page.keyboard.press('Space');
  await expect(page.locator('#demo-size-value')).toHaveText('120%');
  const demoOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(demoOverflow).toBeLessThanOrEqual(1);
  const demoResults = await new AxeBuilder({ page }).analyze();
  expect(demoResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('@claim:reading-settings sample settings visibly change and reset the article', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const preview = page.locator('[data-claim="reading-settings"]');
  await expect(preview.getByText('Quiet evening', { exact: true })).toBeVisible();
  await expect(preview.getByText('120%', { exact: true })).toBeVisible();
  await expect(preview.getByText('1.75×', { exact: true })).toBeVisible();
  await expect(preview.getByText('Warm paper', { exact: true })).toBeVisible();
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
  const motionEnabled = await article.evaluate((element) => {
    const style = getComputedStyle(element);
    return { animationName: style.animationName, animationDuration: style.animationDuration, transitionDuration: style.transitionDuration };
  });
  expect(motionEnabled.animationName).toBe('demo-reader-settle');
  expect(motionEnabled.animationDuration).not.toBe('0s');
  expect(motionEnabled.transitionDuration).not.toBe('0s');

  await page.locator('#demo-motion').check();
  await expect(article).toHaveAttribute('data-reduce-motion', 'true');
  const motionReduced = await article.evaluate((element) => {
    const style = getComputedStyle(element);
    return { animationName: style.animationName, animationDuration: style.animationDuration, transitionDuration: style.transitionDuration };
  });
  expect(motionReduced).toEqual({ animationName: 'none', animationDuration: '0s', transitionDuration: '0s' });

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

test('demo banner controls have a focus indicator with at least 3:1 contrast', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo/');

  for (const control of [page.getByRole('button', { name: 'Reset demo' }), page.getByRole('link', { name: 'Download the extension' })]) {
    await control.focus();
    await expect(control).toBeFocused();
    const colors = await control.evaluate((element) => {
      const focused = getComputedStyle(element);
      const banner = getComputedStyle(element.closest('.demo-banner')!);
      return { outline: focused.outlineColor, adjacent: banner.backgroundColor, width: parseFloat(focused.outlineWidth) };
    });
    expect(colors.width).toBeGreaterThanOrEqual(2);
    expect(contrastRatio(rgbChannels(colors.outline), rgbChannels(colors.adjacent))).toBeGreaterThanOrEqual(3);
  }
});

test('@claim:reading-card-json-transfer a card transfers between clean demo sessions', async ({ browser }) => {
  const sourceContext = await browser.newContext();
  const destinationContext = await browser.newContext();
  const source = await sourceContext.newPage();
  const destination = await destinationContext.newPage();
  await source.goto('/demo/');
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
  await source.locator('#demo-import').setInputFiles({
    name: 'reading-card.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(imported))
  });
  await expect(source.getByRole('status').filter({ hasText: 'Imported “Boundary recovery” into the demo.' })).toBeVisible();

  const downloadPromise = source.waitForEvent('download');
  await source.getByRole('button', { name: 'Export sample card' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('sample-reading-card.json');
  const exportedBuffer = await (await download.createReadStream()).toArray().then((chunks) => Buffer.concat(chunks));
  const body = JSON.parse(exportedBuffer.toString('utf8'));
  expect(body).toEqual(imported);

  await destination.goto('/demo/');
  expect(await destination.evaluate(() => sessionStorage.length)).toBe(0);
  await destination.locator('#demo-import').setInputFiles({
    name: 'exported-reading-card.json',
    mimeType: 'application/json',
    buffer: exportedBuffer
  });
  await expect(destination.locator('#demo-status')).toHaveText('Imported “Boundary recovery” into the demo.');
  const article = destination.locator('#demo-article');
  await expect(article).toHaveCSS('--demo-size', '26px');
  await expect(article).toHaveCSS('--demo-measure', '40ch');
  await expect(article).toHaveCSS('--demo-leading', '1.5');
  await expect(article).toHaveCSS('--demo-para', '2.5em');
  await expect(article).toHaveCSS('--demo-spacing', '0.08em');
  await expect(article).toHaveAttribute('data-contrast', 'dark');
  await expect(article).toHaveAttribute('data-font', 'dyslexia');
  await expect(article).toHaveAttribute('data-reduce-motion', 'false');

  await destination.locator('#demo-import').setInputFiles({
    name: 'broken-card.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{not JSON')
  });
  await expect(destination.locator('#demo-status')).toHaveText('This file is not valid JSON. Check the file, then try again.');
  await sourceContext.close();
  await destinationContext.close();
});

test('@claim:demo-isolation the demo uses only its namespace and first-party requests', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  try {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('readerProfile', 'real-data-sentinel'));
    await page.goto('/?demo=1');
    await expect(page).toHaveURL(/\/demo\/$/);
    await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
    await page.locator('#demo-size').fill('1.35');
    await page.getByRole('button', { name: 'Reset demo' }).click();
    await expect(page.locator('#demo-size-value')).toHaveText('120%');
    const storage = await page.evaluate(() => ({
      local: Object.fromEntries(Object.entries(localStorage)),
      session: Object.keys(sessionStorage)
    }));
    expect(storage.local).toEqual({ readerProfile: 'real-data-sentinel' });
    expect(storage.session).toEqual(['demo:reader-profile']);
    expect([...origins]).toEqual(['http://localhost:4173']);
  } finally {
    await context.close();
  }
});

test('@claim:site-no-tracking public pages make only first-party requests and set no cookies', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const origins = new Set<string>();
  const setCookies: string[] = [];
  page.on('request', (request) => {
    if (request.url().startsWith('http')) origins.add(new URL(request.url()).origin);
  });
  page.on('response', (response) => {
    const setCookie = response.headers()['set-cookie'];
    if (setCookie) setCookies.push(setCookie);
  });

  try {
    for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
      await page.goto(path);
    }
    expect([...origins]).toEqual(['http://localhost:4173']);
    expect(setCookies).toEqual([]);
    expect(await context.cookies()).toEqual([]);
    expect(await page.evaluate(() => document.cookie)).toBe('');
  } finally {
    await context.close();
  }
});

test('the complete first-screen guidance fits a 1440 by 900 viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const locator of [
    page.getByRole('link', { name: 'Try it with sample data' }),
    page.locator('.action-note'),
    page.locator('.hero-facts')
  ]) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  }
  await page.screenshot({ path: 'test-results/desktop-first-screen.png' });
});

test('every public route reflows without horizontal scrolling at 200% text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} overflows at 200% text`).toBeLessThanOrEqual(1);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('unknown routes return the designed 404 response', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible();
});

test('the advertised demo query opens the sandbox route', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('/demo opens the real sample instead of the landing fallback', async ({ page }) => {
  const response = await page.goto('/demo');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Try your settings on a sample article.' })).toBeVisible();
});

test('@claim:extension-download the site provides a valid packaged extension ZIP', async ({ page }) => {
  const response = await page.request.get('/downloads/reader-setting-transfer-chrome.zip');
  expect(response.ok()).toBe(true);
  const body = await response.body();
  expect(body.subarray(0, 4).toString('hex')).toBe('504b0304');
  const entries = execFileSync('unzip', ['-Z1', resolve('dist/site/downloads/reader-setting-transfer-chrome.zip')], { encoding: 'utf8' }).trim().split('\n');
  expect(entries).toEqual(expect.arrayContaining(['manifest.json', 'background.js', 'popup.html', 'reader.html', 'options.html']));
});

test('internal route changes move focus to the destination heading and Back restores heading focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();

  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});
