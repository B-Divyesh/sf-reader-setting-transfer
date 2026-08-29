import { browser, type Browser } from 'wxt/browser';
import { extractArticleFromPage } from '../../lib/article';
import { getOverrides, saveOverrides } from '../../lib/storage';
import { hostnameFromUrl } from '../../lib/profile';
import './style.css';

const readButton = document.querySelector<HTMLButtonElement>('#read-button')!;
const enableButton = document.querySelector<HTMLButtonElement>('#enable-button')!;
const settingsButton = document.querySelector<HTMLButtonElement>('#settings-button')!;
const status = document.querySelector<HTMLElement>('#status')!;
const siteName = document.querySelector<HTMLElement>('#site-name')!;
const stamp = document.querySelector<HTMLElement>('.stamp')!;
let activeTab: Browser.tabs.Tab | undefined;
let hostname = '';

function showError(message: string) {
  status.textContent = message;
  status.dataset.error = '';
  readButton.disabled = false;
  readButton.textContent = 'Try this article again';
}

async function init() {
  // Start from the actionable state if Chromium restores this action surface
  // after an earlier unavailable-tab state.
  readButton.disabled = false;
  readButton.hidden = false;
  readButton.textContent = 'Read this article';
  enableButton.hidden = true;
  // The browser toolbar popup belongs to the last focused browser window, not
  // to a normal tab of its own. `lastFocusedWindow` keeps the selected public
  // article as the target in the native action popup.
  [activeTab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
  if (!activeTab) [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  hostname = hostnameFromUrl(activeTab?.url ?? '');
  if (!activeTab?.id || !hostname || !/^https?:/.test(activeTab.url ?? '')) {
    siteName.textContent = 'Open a normal web article to use the reader.';
    stamp.textContent = 'Unavailable here';
    readButton.disabled = true;
    return;
  }
  siteName.textContent = hostname;
  const override = (await getOverrides())[hostname];
  if (override?.enabled === false) {
    stamp.textContent = 'Off for this site';
    readButton.hidden = true;
    enableButton.hidden = false;
  }
}

readButton.addEventListener('click', async () => {
  if (!activeTab?.id) return;
  readButton.disabled = true;
  readButton.textContent = 'Collecting the article…';
  status.removeAttribute('data-error');
  status.textContent = 'Keeping headings, lists, quotes, and links. Nothing is sent away.';
  try {
    const result = await browser.scripting.executeScript({ target: { tabId: activeTab.id }, func: extractArticleFromPage });
    const article = result[0]?.result;
    if (!article) throw new Error('The page did not return readable article text.');
    await browser.runtime.sendMessage({ type: 'reader-setting-transfer:open-reader', article });
    window.close();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The article could not be collected.';
    showError(message.includes('Cannot access') ? 'This browser page cannot be opened in the reader. Try a public article.' : message);
  }
});

enableButton.addEventListener('click', async () => {
  const overrides = await getOverrides();
  overrides[hostname] = { ...(overrides[hostname] ?? {}), enabled: true };
  await saveOverrides(overrides);
  enableButton.hidden = true;
  readButton.hidden = false;
  stamp.textContent = 'Ready on this page';
  status.textContent = 'Reader restored for this site.';
});

settingsButton.addEventListener('click', () => void browser.runtime.openOptionsPage());
void init().catch(() => showError('The current tab could not be checked. Reopen the extension to try again.'));
